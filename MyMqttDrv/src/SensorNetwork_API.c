/*
 * Copyright (c) 2016, Advantech Co.,Ltd.
 * All rights reserved.
 * Authur: Chinchen-Lin <chinchen.lin@advantech.com.tw>
 * ChangeLog:
 *  2016/01/18 Chinchen: Initial version
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <ctype.h>
#include <mosquitto.h>
#include "mqtt_client_shared.h" // VERSION
#include "AdvLog.h"
#include "MqttHal.h" // protocol handler
#include "SensorNetwork_API.h"
#include "SensorNetwork_APIex.h"
#include "DataProc.h" // fill/free data for report

//-----------------------------------------------------------------------------
// Global vaiable
//-----------------------------------------------------------------------------
static void            *g_UserData;

static SNInfInfo       g_InfInfo;
static UpdateSNDataCbf g_UpdateDataCbf;

int UpdateCbf_IsSet(void)
{
	if(g_UpdateDataCbf == NULL) {
		return -1;
	} else {
		return 0;
	}
}

// Remove double quotes ""
void trimDQ(char * const a)
{
	char *p = a, *q = a;
	while (*q == '\"') ++q;
	while (*q) *p++ = *q++;
	*p = '\0';
	--p;
	while (p > a && ((*p)=='\"' || (*p)==' ')) {
		*p = '\0';
		--p;
	}
}

void GetJsonN(char* _name, char *_str)
{
	sscanf( _str, "%*[^:]:\"%[^\"]%*2c", _name);
}

void GetJsonNV(char* _name, char* _val, char *_str)
{
	sscanf( _str, "%*[^:]:\"%[^\"]%*2c%*[^:]:%[^}]", _name, _val);
	// remove double quotes ""
	trimDQ(_val);
}

// Get/Set function
int GetInfData(InBaseData *_input, OutBaseData *output)
{
	char ucName[32];
	char buffer[1024];

	if( strcmp( "Info", _input->psType) != 0 ) {
		return -1;
	}

	//ADV_INFO("%s: name(%s)\n", __func__, g_InfInfo.sInfName);
	//printf("\033[33m %s: name(%s) \033[0m\n", __func__, g_InfInfo.sInfName);

	memset(ucName, 0, sizeof(ucName));
	memset(buffer, 0, sizeof(buffer));
	GetJsonN(ucName, _input->psData);

	if(strcmp("Health", ucName) == 0) {
		sprintf(buffer, "{\"n\":\"%s\", \"v\":%d}", ucName, 100);
	} else if(strcmp("Name", ucName) == 0) {
        sprintf(buffer, "{\"n\":\"%s\", \"sv\":\"%s\"}", ucName, g_InfInfo.sInfName);
	}

	if(*output->iSizeData < strlen(buffer)+1) {
		*output->iSizeData = strlen(buffer)+1;
		output->psData = (char *)realloc(output->psData, *output->iSizeData);
	}
	strcpy(output->psData, buffer);

	return SN_OK;
}

int GetSenData(char *_sUID, InBaseData *_input, OutBaseData *output)
{
	senhub_info_t *pMoteInfo;
	char ucName[32];
	char buffer[1024];

	//printf("\033[33m %s(%d):psType(%s) \033[0m\n", __func__, __LINE__, _input->psType);
	if( strcmp( "Info", _input->psType) == 0 ||
		strcmp( "Net", _input->psType) == 0 ||
		strcmp( "SenData", _input->psType) == 0) {
	
		pMoteInfo = MqttHal_GetMoteInfoByMac(_sUID);
		if (NULL == pMoteInfo) {
			ADV_ERROR("%s: Mote info not found!\n", __func__);
			return -2;
		}

		//ADV_INFO("%s:psType(%s), hostname(%s), moteId(%d)\n", __func__, _input->psType, pMoteInfo->hostName, pMoteInfo->id);
		//printf("\033[33m %s:psType(%s), hostname(%s), moteId(%d), psData=%s \033[0m\n", __func__, _input->psType, pMoteInfo->hostName, pMoteInfo->id, _input->psData);

		memset(ucName, 0, sizeof(ucName));
		memset(buffer, 0, sizeof(buffer));
		GetJsonN(ucName, _input->psData);

		if(strcmp("Health", ucName) == 0) {
			sprintf(buffer, "{\"n\":\"%s\", \"v\":%d}", ucName, 100);
		} else if(strcmp("Name", ucName) == 0) {
        	sprintf(buffer, "{\"n\":\"%s\", \"sv\":\"%s\"}", ucName, pMoteInfo->hostName);
		}

		if(*output->iSizeData < strlen(buffer)+1) {
			*output->iSizeData = strlen(buffer)+1;
			output->psData = (char *)realloc(output->psData, *output->iSizeData);
		}
		strcpy(output->psData, buffer);

		return SN_OK;
	} else {
		return -1;
	}
}

int SetInfData(InBaseData *_input, OutBaseData *output)
{
	char ucName[32];
	char ucVal[32];
	char buffer[1024];
	int ival = 0;

	//ADV_INFO("%s: psType = %s, name = %s\n", __func__, _input->psType, g_InfInfo.sInfName);

	if( strcmp( "Info", _input->psType) != 0 ) {
		return -1;
	}

	memset(ucName, 0, sizeof(ucName));
	memset(ucVal, 0, sizeof(ucVal));
	memset(buffer, 0, sizeof(buffer));
	GetJsonNV(ucName, ucVal, _input->psData);

	//ADV_INFO("%s: ucName = %s, ucVal = %s\n", __func__, ucName, ucVal);
	// Set Interface 
	if(strcmp("reset", ucName) == 0) {
		ival = atoi(ucVal);
		if(ival == 1) {
			//reset interface
			printf("%s: reset interface isn't implement for this module.\n", __func__ );
		}
		sprintf(buffer, "{\"n\":\"%s\",\"bv\":%d}", ucName, ival);
	} else if(strcmp("Name", ucName) == 0) {
		memset(g_InfInfo.sInfName, 0, sizeof(g_InfInfo.sInfName));
		strcpy(g_InfInfo.sInfName, ucVal);
        sprintf(buffer, "{\"n\":\"%s\", \"sv\":\"%s\"}", ucName, g_InfInfo.sInfName);
	}

	if(*output->iSizeData < strlen(buffer)+1) {
		*output->iSizeData = strlen(buffer)+1;
		output->psData = (char *)realloc(output->psData, *output->iSizeData);
	}
	strcpy(output->psData, buffer);

	return SN_OK;
}

int SetSenData(char *_sUID, InBaseData *_input, OutBaseData *output)
{
	senhub_info_t *pMoteInfo;
	char ucName[32];
	char ucVal[32];
	char buffer[1024];
	int cmdType = Mote_Cmd_None;

	//printf("%s(%d):psType(%s) macAddr=%s\n", __func__, __LINE__, _input->psType, _sUID);
	if( strcmp( "Info", _input->psType) != 0 &&
			strcmp( "SenData", _input->psType) != 0 &&
			strcmp( "Action", _input->psType) != 0) {
		return -1;
	}
	
	pMoteInfo = MqttHal_GetMoteInfoByMac(_sUID);

	if (NULL == pMoteInfo) {
		ADV_ERROR("%s: Mote info not found!\n", __func__);
		return -2;
	}

	//ADV_INFO("%s:psType(%s), hostname(%s), moteId(%d)\n", __func__, _input->psType, pMoteInfo->hostName, pMoteInfo->id);

	// Set SenData
	memset(ucName, 0, sizeof(ucName));
	memset(ucVal, 0, sizeof(ucVal));
	GetJsonNV(ucName, ucVal, _input->psData);

	memset(buffer, 0, sizeof(buffer));
	// Set SenHub name
	if(strcmp( "Info", _input->psType) == 0) {
		if(strcmp("Name", ucName) == 0) {
			//ADV_INFO("%s: Set sensor hub name\n", __func__);
			//  send cmd to set sensor hub name
			sprintf(buffer, "{\"n\":\"%s\",\"sv\":\"%s\"}", ucName, ucVal);
			cmdType = Mote_Cmd_SetMoteName;
		} else if(strcmp("reset", ucName) == 0) {
			//ADV_INFO("%s: reset sensor hub\n", __func__);
			//  send cmd to reset sensor hub 
			sprintf(buffer, "{\"n\":\"%s\",\"bv\":%d}", ucName, atoi(ucVal));
			cmdType = Mote_Cmd_SetMoteReset;
		} else {
			//ADV_INFO("%s: not define this cmd\n", __func__);
			cmdType = Mote_Cmd_None;
		}
	} else if(strcmp( "SenData", _input->psType) == 0) {
		//ADV_INFO("%s: Set %s to %s\n", __func__, ucName, ucVal);
		sprintf(buffer, "{\"n\":\"%s\",\"bv\":%d}", ucName, atoi(ucVal));
		cmdType = Mote_Cmd_SetSensorValue;
	} else if(strcmp( "Action", _input->psType) == 0) {
		if(strcmp("AutoReport", ucName) == 0) {
			//ADV_INFO("%s: Set %s to %s\n", __func__, ucName, ucVal);
			sprintf(buffer, "{\"n\":\"%s\",\"bv\":%d}", ucName, atoi(ucVal));
			cmdType = Mote_Cmd_SetAutoReport;
		} else {
			ADV_INFO("%s: not define this cmd\n", __func__);
			cmdType = Mote_Cmd_None;
		}
	} else {
		ADV_INFO("%s: not define this cmd\n", __func__);
		cmdType = Mote_Cmd_None;
	}
	if(cmdType == Mote_Cmd_None) {
		return -3;
	}
	
	//printf("%s: ucName=%s, ucVal=%s\n", __func__, ucName, ucVal);
	if(MqttHal_Publish(pMoteInfo->macAddress, cmdType, ucName, ucVal) != 0) {
		return -4;
	}

	if(*output->iSizeData < strlen(buffer)+1) {
		*output->iSizeData = strlen(buffer)+1;
		output->psData = (char *)realloc(output->psData, *output->iSizeData);
	}
	strcpy(output->psData, buffer);

	if(cmdType == Mote_Cmd_SetMoteName) {
		//printf("\033[33m %s: Rename (%s->%s) \033[0m\n", __func__, pMoteInfo->hostName, ucVal);
		snprintf(pMoteInfo->hostName, sizeof(pMoteInfo->hostName), "%s", ucVal);
		//SensorHub_Register(pMoteInfo);
		//SensorHub_InfoSpec(pMoteInfo);
		//printf("\033[33m %s: Mote Name(%s) \033[0m\n", __func__, pMoteInfo->hostName);
	}

	return SN_OK;
}

//-----------------------------------------------------------------------------
// Command API 1000
//-----------------------------------------------------------------------------
int GatewayIntf_Update()
{
	SNInterfaceData SNInfData;

	if(g_UpdateDataCbf == NULL) {
		ADV_TRACE("g_UpdateDataCbf is not register\n");
		return -1;
	}

	//ADV_INFO("%s: 1000 --------------------------\n", __func__);
	memset(&SNInfData, 0, sizeof(SNInterfaceData));
	if(fillSNInfData(&SNInfData) == 0) {
		g_UpdateDataCbf(SN_Inf_UpdateInterface_Data, &SNInfData, sizeof(SNInterfaceData), g_UserData, NULL, NULL, NULL);
	}
	freeSNInfData(&SNInfData);

	return 0;
}

//-----------------------------------------------------------------------------
// Command API 2000~2003
//-----------------------------------------------------------------------------
// CmdID = 2000, Sensor Hub Register
int SensorHub_Register(senhub_info_t *pMote)
{
	SenHubInfo nodeInfo;

	if(pMote == NULL) {
		ADV_TRACE("pMote is NULL\n");
		return -1;
	}

	if(g_UpdateDataCbf == NULL) {
		ADV_TRACE("g_UpdateDataCbf is not register\n");
		return -2;
	}

	memset(&nodeInfo, 0, sizeof(SenHubInfo));
	if(fillSenHubInfo(&nodeInfo, pMote) == 0) {
	//ADV_INFO("%s: 2000 --------------------------\n", __func__);
		g_UpdateDataCbf(SN_SenHub_Register, &nodeInfo, sizeof(SenHubInfo), g_UserData, NULL, NULL, NULL);
	}

	return 0;
}

// CmdID = 2001, Sensor Hub InfoSpec
int SensorHub_InfoSpec(senhub_info_t *pMote)
{
	InSenData SenInfoSpec;
	
	if(pMote == NULL) {
		ADV_TRACE("pMote is NULL\n");
		return -1;
	}

	if(g_UpdateDataCbf == NULL) {
		ADV_TRACE("%s: g_UpdateDataCbf is NULL\n", __func__);
		return -2;
	}
	memset(&SenInfoSpec, 0, sizeof(InSenData));
	if(fillSenInfoSpec(&SenInfoSpec, pMote) == 0) {
	//ADV_INFO("%s: 2001 --------------------------\n", __func__);
		g_UpdateDataCbf(SN_SenHub_SendInfoSpec, &SenInfoSpec, sizeof(InSenData), g_UserData, NULL, NULL, NULL);
	}
	freeSenInfoSpec(&SenInfoSpec);

	return 0;
}

// CmdID = 2002, Sensor Hub Data
int SensorHub_Data(senhub_info_t *pMote)
{
	InSenData       SenData;

	if(pMote == NULL) {
		ADV_TRACE("pMote is NULL\n");
		return -1;
	}
	if(g_UpdateDataCbf == NULL) {
		ADV_ERROR("%s: g_UpdateDataCbf is NULL\n", __func__);
		return -2;
	}
	memset(&SenData, 0, sizeof(InSenData));
	if(fillSenData(&SenData, pMote) == 0) {
	//ADV_INFO("%s: 2002 --------------------------\n", __func__);
		//ADV_INFO("%s: mote mac=%s\n", __func__, pMote->macAddress);
		g_UpdateDataCbf(SN_SenHub_AutoReportData, &SenData, sizeof(InSenData), g_UserData, NULL, NULL, NULL);
	}
	freeSenData(&SenData);

	return 0;
}

// CmdID = 2003, Sensor Hub disconnect
int SensorHub_DisConn(senhub_info_t *pMote)
{
	InSenData       SenData;

	if (NULL == pMote) {
		ADV_ERROR("%s: Mote lost report failed: NULL\n", __func__);
		return -1;
	}

	if(g_UpdateDataCbf == NULL) {
		ADV_ERROR("%s: g_UpdateDataCbf is NULL\n", __func__);
		return -1;
	}

	//ADV_INFO("%s: 2003 --------------------------\n", __func__);
	memset(&SenData, 0, sizeof(InSenData));
	snprintf(SenData.sUID, sizeof(SenData.sUID),
			"%s",
			pMote->macAddress
			);
	SenData.inDataClass.iTypeCount = 0;
	SenData.pExtened = NULL;

	g_UpdateDataCbf(SN_SenHub_Disconnect, &SenData, sizeof(InSenData), g_UserData, NULL, NULL, NULL);	

	return 0;
}

//-----------------------------------------------------------------------------
// SensorNetwork API
//-----------------------------------------------------------------------------
SN_CODE SNCALL SN_Initialize(void *_pInUserData)
{
	g_UserData = _pInUserData;
	g_UpdateDataCbf = NULL;

	// Your protocol handler 
	MqttHal_Proc();

	return SN_OK;
}

SN_CODE SNCALL SN_Uninitialize(void *pInParam)
{
	// free global variable

	return SN_OK;
}


SN_CODE SNCALL SN_GetVersion(char *_psVersion, int _iBufLen)
{
	// Your protocol/handler version
	if((unsigned int)_iBufLen < strlen(VERSION)+1) {
		_psVersion = (char *)realloc(_psVersion, strlen(VERSION)+1);
	}
	strcpy(_psVersion, VERSION);
	return SN_OK;
}

void SNCALL SN_SetUpdateDataCbf(UpdateSNDataCbf _UpdateSNDataCbf) 
{
	//ADV_INFO("%s: \n", __func__);
	g_UpdateDataCbf = _UpdateSNDataCbf;
}

SN_CODE SNCALL SN_GetCapability(SNMultiInfInfo *pOutSNMultiInfInfo)
{
	if(g_UpdateDataCbf == NULL) return SN_ER_FAILED;

	fillSNInfInfos(pOutSNMultiInfInfo);
	strcpy(g_InfInfo.sInfName, pOutSNMultiInfInfo->SNInfs[0].sInfName);
	strcpy(g_InfInfo.sInfID, pOutSNMultiInfInfo->SNInfs[0].sInfID);

	return SN_OK;
}

SN_CODE SNCALL SN_GetData(SN_CTL_ID CmdID, InSenData *pInSenData, OutSenData *pOutSenData) 
{
	int ret = SN_ER_FAILED;
	int i;
	InBaseData *input = NULL;
	OutBaseData *output = NULL;

	if(pInSenData->inDataClass.iTypeCount != pOutSenData->outDataClass.iTypeCount) return SN_ER_VALUE_OUT_OF_RNAGE;

	//ADV_INFO("%s: sUID = %s, CmdID = %d, inTypeCount = %d, outTypeCount = %d\n", __func__, pInSenData->sUID, CmdID, pInSenData->inDataClass.iTypeCount, pOutSenData->outDataClass.iTypeCount);
	//printf("\033[33m %s: sUID = %s, CmdID = %d, inTypeCount = %d, outTypeCount = %d \033[0m\n", __func__, pInSenData->sUID, CmdID, pInSenData->inDataClass.iTypeCount, pOutSenData->outDataClass.iTypeCount);

	switch(CmdID) {
		// 6000
		case SN_Inf_Get:
			for(i = 0 ; i < pInSenData->inDataClass.iTypeCount ; i++) {
				input = &pInSenData->inDataClass.pInBaseDataArray[i];
				output = &pOutSenData->outDataClass.pOutBaseDataArray[i];
				if(GetInfData(input, output) == SN_OK) {
					ADV_TRACE("1. input->psData = %s\n", input->psData);
					ADV_TRACE("2. output->psData = %s\n", output->psData);
				}
			}
			ret = SN_OK;
			break;
		
		// 6020
		case SN_SenHub_Get:
			// psType =  Info or SenData?
			for(i = 0 ; i < pInSenData->inDataClass.iTypeCount ; i++) {
				input = &pInSenData->inDataClass.pInBaseDataArray[i];
				output = &pOutSenData->outDataClass.pOutBaseDataArray[i];
				if(GetSenData(pInSenData->sUID, input, output) == SN_OK) {
					ADV_TRACE("1. input->psData = %s\n", input->psData);
					ADV_TRACE("2. output->psData = %s\n", output->psData);
				}
			}
			ret = SN_OK;
			break;
		
		default:
			ADV_ERROR("@@@@@@@@@@@@@@ Unknow command - %d\n", CmdID);
			ret = SN_ER_NOT_IMPLEMENT;
			break;
	}
	return (SN_CODE)ret;
}

SN_CODE SNCALL SN_SetData(SN_CTL_ID CmdID, InSenData *pInSenData, OutSenData *pOutSenData) 
{
	int ret = SN_ER_FAILED;
	int i;
	InBaseData *input = NULL;
	OutBaseData *output = NULL;

	if(pInSenData->inDataClass.iTypeCount != pOutSenData->outDataClass.iTypeCount) return SN_ER_VALUE_OUT_OF_RNAGE;

	//ADV_INFO("%s: sUID = %s, CmdID = %d, inTypeCount = %d, outTypeCount = %d\n", __func__, pInSenData->sUID, CmdID, pInSenData->inDataClass.iTypeCount, pOutSenData->outDataClass.iTypeCount);

	switch(CmdID) {
		// 6001
		case SN_Inf_Set:
			if(strcmp(g_InfInfo.sInfID, pInSenData->sUID) != 0) {
				return (SN_CODE)ret;
			}
			for(i = 0 ; i < pInSenData->inDataClass.iTypeCount ; i++) {
				input = &pInSenData->inDataClass.pInBaseDataArray[i];
				output = &pOutSenData->outDataClass.pOutBaseDataArray[i];

				if(SetInfData(input, output) == SN_OK) {
					ADV_TRACE("1. input->psData = %s\n", input->psData);
					ADV_TRACE("2. output->psData = %s\n", output->psData);
				}
			}
			ret = SN_OK;
			break;
		
		// 6021
		case SN_SenHub_Set:
			// psType =  Info or SenData?
			for(i = 0 ; i < pInSenData->inDataClass.iTypeCount ; i++) {
				input = &pInSenData->inDataClass.pInBaseDataArray[i];
				output = &pOutSenData->outDataClass.pOutBaseDataArray[i];
				
				if(SetSenData(pInSenData->sUID, input, output) == SN_OK) {
					ADV_TRACE("1. input->psData = %s\n", input->psData);
					ADV_TRACE("2. output->psData = %s\n", output->psData);
				} else {
					return SN_ER_FAILED;
				}
			}
			ret = SN_OK;

			break;
		
		default:
			ADV_ERROR("@@@@@@@@@@@@@@ Unknow command - %d\n", CmdID);
			ret = SN_ER_NOT_IMPLEMENT;
			break;
	}

	return (SN_CODE)ret;
}
