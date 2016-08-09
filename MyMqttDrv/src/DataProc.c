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
#include "mqtt_client_shared.h"
#include "AdvLog.h"
#include "MqttHal.h"
#include "DataProc.h"
#include "AdvJSON.h"

static char            g_GatewayMAC[MAX_MACADDRESS_LEN];

//-----------------------------------------------------------------------------
// Sensor Info API
//-----------------------------------------------------------------------------
#define IFACE_INFO_JSON "{\"n\":\"SenHubList\", \"sv\":\"\", \"asm\":\"r\"},{\"n\":\"Neighbor\", \"sv\":\"\", \"asm\":\"r\"},{\"n\":\"Health\", \"v\":-1, \"asm\":\"r\"},{\"n\":\"Name\", \"sv\":\"%s\", \"asm\":\"r\"},{\"n\":\"sw\", \"sv\":\"%s\", \"asm\":\"r\"},{\"n\":\"reset\", \"bv\":0, \"asm\":\"r\"}"

#define IFACE_INFO_DATA_JSON "{\"n\":\"SenHubList\",\"sv\":\"%s\"},{\"n\":\"Neighbor\", \"sv\":\"%s\"},{\"n\":\"Health\",\"v\":%d},{\"n\":\"sw\", \"sv\":\"%s\"},{\"n\":\"reset\", \"bv\":%d}"

#define IFACE_INFO_ACTION_JSON "{\"n\":\"AutoReport\",\"bv\":%d,\"asm\":\"%s\"}"

#define SENHUB_INFO_SPEC_NET_JSON "{\"n\":\"Health\",\"v\":%s,\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"%s\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"%s\",\"asm\":\"r\"}"

#define SENSOR_DATA_NET_JSON "{\"n\":\"Health\",\"v\":%s},{\"n\":\"Neighbor\",\"sv\":\"%s\"}"

//-----------------------------------------------------------------------------
// Private Function:
//-----------------------------------------------------------------------------
// Revmoe start '[' & end ']'
void trimBracket(char * const a)
{
	char *p = a, *q = a;
	while (*q == '[') ++q;
	while (*q) *p++ = *q++;
	*p = '\0';
	--p;
	while (p > a && (*p)==']') {
		*p = '\0';
		--p;
    }
}

//-----------------------------------------------------------------------------
// Public Function:
//-----------------------------------------------------------------------------
void freeSNInfData(SNInterfaceData *pSNInfData)
{
	int i;

	ADV_TRACE("%s: \n", __func__);
	if (NULL != pSNInfData) {
		for(i=0; i < pSNInfData->inDataClass.iTypeCount; i++) {
			if (NULL != pSNInfData->inDataClass.pInBaseDataArray[i].psType) {
				free(pSNInfData->inDataClass.pInBaseDataArray[i].psType);	
			}
			if (NULL != pSNInfData->inDataClass.pInBaseDataArray[i].psData) {
				free(pSNInfData->inDataClass.pInBaseDataArray[i].psData);	
			}
		}
		if (NULL != pSNInfData->inDataClass.pInBaseDataArray) {
			free(pSNInfData->inDataClass.pInBaseDataArray);	
		}

		if (NULL != pSNInfData->pExtened)
			free(pSNInfData->pExtened);
		
		memset(pSNInfData, 0, sizeof(SNInterfaceData));
	}
}

void freeSenInfoSpec(InSenData *pSenInfo)
{
	int i;

	ADV_TRACE("%s: \n", __func__);
	if (NULL != pSenInfo) {
		for(i=0; i < pSenInfo->inDataClass.iTypeCount; i++) {
			if (NULL != pSenInfo->inDataClass.pInBaseDataArray[i].psType)
				free(pSenInfo->inDataClass.pInBaseDataArray[i].psType);	
			if (NULL != pSenInfo->inDataClass.pInBaseDataArray[i].psData)
				free(pSenInfo->inDataClass.pInBaseDataArray[i].psData);	
		}
		free(pSenInfo->inDataClass.pInBaseDataArray);	

		if (NULL != pSenInfo->pExtened)
			free(pSenInfo->pExtened);
		
		memset(pSenInfo, 0, sizeof(InSenData));
	}
}

void freeSenData(InSenData *pSenData)
{
	int i;

	//ADV_TRACE("%s: \n", __func__);
	if (NULL != pSenData) {
		for(i=0; i < pSenData->inDataClass.iTypeCount; i++) {
			if (NULL != pSenData->inDataClass.pInBaseDataArray[i].psType)
				free(pSenData->inDataClass.pInBaseDataArray[i].psType);	
			if (NULL != pSenData->inDataClass.pInBaseDataArray[i].psData)
				free(pSenData->inDataClass.pInBaseDataArray[i].psData);	
		}
		if (NULL != pSenData->inDataClass.pInBaseDataArray) {
			free(pSenData->inDataClass.pInBaseDataArray);
		}

		if (NULL != pSenData->pExtened)
			free(pSenData->pExtened);
		
		memset(pSenData, 0, sizeof(InSenData));
	}
}


// Create Interface Data 
// for SN_GetCapability
void fillSNInfInfos(SNInfInfos *pSNInfInfos)
{
	//printf("%s: in\n", __func__);
	snprintf(pSNInfInfos->sComType, sizeof(pSNInfInfos->sComType), "%s", CONTYPE);

	pSNInfInfos->iNum = 1;

	// Detail Information of Sensor Network Interface
	memset(g_GatewayMAC, 0, MAX_MACADDRESS_LEN);
	MqttHal_GetNetworkIntfaceMAC(IFACENAME, g_GatewayMAC);

	snprintf(pSNInfInfos->SNInfs[0].sInfName, sizeof(pSNInfInfos->SNInfs[0].sInfName), "%s", CONNAME(0));

	snprintf(pSNInfInfos->SNInfs[0].sInfID, sizeof(pSNInfInfos->SNInfs[0].sInfID),
			"%02x%02x%s",
			0, 0, g_GatewayMAC
			);

	pSNInfInfos->SNInfs[0].outDataClass.iTypeCount = 1;
	pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].psType = strdup("Info");
	pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].iSizeType = sizeof(pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].psType);

	sprintf(pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].psData,
			IFACE_INFO_JSON,
			CONNAME(0), 
			VERSION
			);
	*pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].iSizeData = strlen(pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].psData);

	MqttHal_UpdateIntf(1);
	
	ADV_INFO("=============================================\n");
	ADV_INFO("sComType=%s, ", pSNInfInfos->sComType);
	ADV_INFO("iNum=%d, ", pSNInfInfos->iNum);
	ADV_INFO("InfName=%s, ", pSNInfInfos->SNInfs[0].sInfName);
	ADV_INFO("InfID=%s\n", pSNInfInfos->SNInfs[0].sInfID);

	ADV_INFO("out type count=%d, ", pSNInfInfos->SNInfs[0].outDataClass.iTypeCount);
	ADV_INFO("out type=%s, ", pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].psType);
	ADV_INFO("size=%d\n", pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].iSizeType);

	ADV_INFO("out data=%s, ", pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].psData);
	ADV_INFO("size=%d\n", *pSNInfInfos->SNInfs[0].outDataClass.pOutBaseDataArray[0].iSizeData);
	ADV_INFO("=============================================\n");

}

// Create Sensor Network Interface Data
// CmdID=1000
int fillSNInfData(SNInterfaceData *pSNInfData)
{
	int bufSize;
	char macList[2048];
	char neighborList[2048];
	
	//ADV_INFO("%s: \n", __func__);

	snprintf(pSNInfData->sComType, sizeof(pSNInfData->sComType), "%s", CONTYPE);
	snprintf(pSNInfData->sInfID, sizeof(pSNInfData->sInfID),
			"%02x%02x%s",
			0, 0, g_GatewayMAC
			);

	pSNInfData->inDataClass.iTypeCount = 2;
	pSNInfData->inDataClass.pInBaseDataArray = (InBaseData *)malloc(sizeof(InBaseData) * pSNInfData->inDataClass.iTypeCount);
	pSNInfData->inDataClass.pInBaseDataArray[0].psType = strdup("Info");
	pSNInfData->inDataClass.pInBaseDataArray[0].iSizeType = sizeof(pSNInfData->inDataClass.pInBaseDataArray[0].psType);

	// Sensor Hub List
	memset(macList, 0, sizeof(macList));
	MqttHal_GetMacAddrList(macList, sizeof(macList), 1);
	// Neighbors
	memset(neighborList, 0, sizeof(neighborList));
	MqttHal_GetMacAddrList(neighborList, sizeof(neighborList), 0);

	bufSize = 512;
	pSNInfData->inDataClass.pInBaseDataArray[0].psData = malloc(bufSize);
	if (NULL == pSNInfData->inDataClass.pInBaseDataArray[0].psData)
		return -1;
	memset(pSNInfData->inDataClass.pInBaseDataArray[0].psData, 0, bufSize);

	sprintf(pSNInfData->inDataClass.pInBaseDataArray[0].psData,
			IFACE_INFO_DATA_JSON,
			macList, neighborList, 100, VERSION, 0);

	pSNInfData->inDataClass.pInBaseDataArray[0].iSizeData = strlen(pSNInfData->inDataClass.pInBaseDataArray[0].psData);

	// Action
	pSNInfData->inDataClass.pInBaseDataArray[1].psType = strdup("Action");
	pSNInfData->inDataClass.pInBaseDataArray[1].iSizeType = sizeof(pSNInfData->inDataClass.pInBaseDataArray[1].psType);
	bufSize = 512;
	pSNInfData->inDataClass.pInBaseDataArray[1].psData = malloc(bufSize);
	if (NULL == pSNInfData->inDataClass.pInBaseDataArray[1].psData)
		return -2;
	memset(pSNInfData->inDataClass.pInBaseDataArray[1].psData, 0, bufSize);
	sprintf(pSNInfData->inDataClass.pInBaseDataArray[1].psData,
			IFACE_INFO_ACTION_JSON, 1, "rw");
	pSNInfData->inDataClass.pInBaseDataArray[1].iSizeData = strlen(pSNInfData->inDataClass.pInBaseDataArray[1].psData);

	ADV_INFO("=============================================\n");
	ADV_INFO("%s: ", __func__);
	ADV_INFO("sComType=%s, ", pSNInfData->sComType);
	//ADV_INFO("InfName=%s, ", pSNInfData->SNInf.sInfName);
	ADV_INFO("InfID=%s, ", pSNInfData->sInfID);
	ADV_INFO("Type count=%d, ", pSNInfData->inDataClass.iTypeCount);
	ADV_INFO("type=%s, ", pSNInfData->inDataClass.pInBaseDataArray[0].psType);
	ADV_INFO("type size=%d, ", pSNInfData->inDataClass.pInBaseDataArray[0].iSizeType);
	ADV_INFO("data=%s, ", pSNInfData->inDataClass.pInBaseDataArray[0].psData);
	ADV_INFO("data size=%d\n", pSNInfData->inDataClass.pInBaseDataArray[0].iSizeData);
	ADV_INFO("=============================================\n");

	return 0;
}

// CmdID = 2000
int fillSenHubInfo(SenHubInfo *pNodeInfo, senhub_info_t *pMote)
{
	//ADV_INFO("%s: \n", __func__);

	if (NULL==pNodeInfo || NULL==pMote)
		return -1;
	
	snprintf(pNodeInfo->sUID, sizeof(pNodeInfo->sUID),
			"%s",
			pMote->macAddress
			);

	snprintf(pNodeInfo->sSN, sizeof(pNodeInfo->sSN),
			"%s",
			pMote->macAddress
			);

	snprintf(pNodeInfo->sHostName, sizeof(pNodeInfo->sHostName), "%s", pMote->hostName);

	snprintf(pNodeInfo->sProduct, sizeof(pNodeInfo->sProduct), "%s", pMote->productName);
	
	return 0;
}

// CmdID = 2001
int fillSenInfoSpec(InSenData *pSenData, senhub_info_t *pMote)
{
	int bufSize;
	char nodeContent[MAX_JSON_NODE_SIZE];
	char health[4];
	char neighborList[1024];
	char softwareVer[MAX_SOFTWAREVERSION_LEN];

	//ADV_INFO("%s: \n", __func__);
	if (NULL==pSenData || NULL==pMote) {
		ADV_TRACE("Fill SenInfoSpec failed: NULL\n");
		return -1;
	}

	snprintf(pSenData->sUID, sizeof(pSenData->sUID),
			"%s",
			pMote->macAddress
			);

	pSenData->inDataClass.iTypeCount = 4;
	pSenData->inDataClass.pInBaseDataArray = (InBaseData *)malloc(sizeof(InBaseData) * pSenData->inDataClass.iTypeCount);
	// psType = Info
	pSenData->inDataClass.pInBaseDataArray[0].psType = strdup("Info");
	pSenData->inDataClass.pInBaseDataArray[0].iSizeType = sizeof(pSenData->inDataClass.pInBaseDataArray[0].psType);

	bufSize = MAX_SENDATA_LEN;
	pSenData->inDataClass.pInBaseDataArray[0].psData = malloc(bufSize);
	if (NULL == pSenData->inDataClass.pInBaseDataArray[0].psData)
		return -2;
	memset(pSenData->inDataClass.pInBaseDataArray[0].psData, 0, bufSize);

	// 
	memset(nodeContent, 0, MAX_JSON_NODE_SIZE);
	JSON_Get(pMote->jsonNode, OBJ_E_INFO_SENHUB, nodeContent, sizeof(nodeContent));
	trimBracket(nodeContent);

	snprintf(pSenData->inDataClass.pInBaseDataArray[0].psData, bufSize,
			"%s", nodeContent);
	pSenData->inDataClass.pInBaseDataArray[0].iSizeData = strlen(pSenData->inDataClass.pInBaseDataArray[0].psData);
	
	// psType = SenData
	pSenData->inDataClass.pInBaseDataArray[1].psType = strdup("SenData");
	pSenData->inDataClass.pInBaseDataArray[1].iSizeType = strlen(pSenData->inDataClass.pInBaseDataArray[1].psType);
	bufSize = sizeof(nodeContent);
	pSenData->inDataClass.pInBaseDataArray[1].psData = malloc(bufSize);
	if (NULL == pSenData->inDataClass.pInBaseDataArray[1].psData)
		return -3;
	memset(pSenData->inDataClass.pInBaseDataArray[1].psData, 0, bufSize);

	//
	memset(nodeContent, 0, MAX_JSON_NODE_SIZE);
	JSON_Get(pMote->jsonNode, OBJ_E_SENDATA_SENHUB, nodeContent, sizeof(nodeContent));
	trimBracket(nodeContent);

	snprintf(pSenData->inDataClass.pInBaseDataArray[1].psData, bufSize,
			"%s", nodeContent);
	pSenData->inDataClass.pInBaseDataArray[1].iSizeData = strlen(pSenData->inDataClass.pInBaseDataArray[1].psData);

	// psType = Net
	pSenData->inDataClass.pInBaseDataArray[2].psType = strdup("Net");
	pSenData->inDataClass.pInBaseDataArray[2].iSizeType = sizeof(pSenData->inDataClass.pInBaseDataArray[2].psType);

	bufSize = MAX_SENDATA_LEN;
	pSenData->inDataClass.pInBaseDataArray[2].psData = malloc(bufSize);
	if (NULL == pSenData->inDataClass.pInBaseDataArray[2].psData)
		return -4;
	memset(pSenData->inDataClass.pInBaseDataArray[2].psData, 0, bufSize);

	//
	memset(nodeContent, 0, MAX_JSON_NODE_SIZE);
	JSON_Get(pMote->jsonNode, OBJ_E_NET_HEALTH_SENHUB, nodeContent, sizeof(nodeContent));
	sprintf(health, "%s", nodeContent);
	memset(nodeContent, 0, MAX_JSON_NODE_SIZE);
	sprintf(nodeContent, "0000%s" , g_GatewayMAC);
	memset(neighborList, 0, MAX_JSON_NODE_SIZE);
	sprintf(neighborList, "%s", nodeContent);
	memset(nodeContent, 0, MAX_JSON_NODE_SIZE);
	JSON_Get(pMote->jsonNode, OBJ_E_NET_SWVER_SENHUB, nodeContent, sizeof(nodeContent));
	sprintf(softwareVer, "%s", nodeContent);

	snprintf(pSenData->inDataClass.pInBaseDataArray[2].psData, bufSize,
            SENHUB_INFO_SPEC_NET_JSON,
            health, neighborList, softwareVer);

	pSenData->inDataClass.pInBaseDataArray[2].iSizeData = strlen(pSenData->inDataClass.pInBaseDataArray[2].psData);
	
	// psType = AutoReport
	pSenData->inDataClass.pInBaseDataArray[3].psType = strdup("Action");
	pSenData->inDataClass.pInBaseDataArray[3].iSizeType = sizeof(pSenData->inDataClass.pInBaseDataArray[3].psType);

	bufSize = MAX_SENDATA_LEN;
	pSenData->inDataClass.pInBaseDataArray[3].psData = malloc(bufSize);
	if (NULL == pSenData->inDataClass.pInBaseDataArray[3].psData)
		return -5;
	memset(pSenData->inDataClass.pInBaseDataArray[3].psData, 0, bufSize);

	snprintf(pSenData->inDataClass.pInBaseDataArray[3].psData, bufSize,
			IFACE_INFO_ACTION_JSON, 1, "r");

	pSenData->inDataClass.pInBaseDataArray[3].iSizeData = strlen(pSenData->inDataClass.pInBaseDataArray[3].psData);

	return 0;
}

// CmdID = 2002
int fillSenData(InSenData *pSenData, senhub_info_t *pMote)
{
	int bufSize;
	char nodeContent[MAX_JSON_NODE_SIZE];
	char health[4];
	char neighborList[1024];

	//ADV_INFO("%s: \n", __func__);
	if (NULL==pSenData || NULL==pMote) {
		ADV_ERROR("Fill SenData failed: NULL\n");
		return -1;
	}

	snprintf(pSenData->sUID, sizeof(pSenData->sUID),
			"%s",
			pMote->macAddress
			);

	pSenData->inDataClass.iTypeCount = 2;
	pSenData->inDataClass.pInBaseDataArray = (InBaseData *)malloc(sizeof(InBaseData) * pSenData->inDataClass.iTypeCount);
	pSenData->inDataClass.pInBaseDataArray[0].psType = strdup("SenData");
	pSenData->inDataClass.pInBaseDataArray[0].iSizeType = sizeof(pSenData->inDataClass.pInBaseDataArray[0].psType);

	bufSize = sizeof(nodeContent);
	pSenData->inDataClass.pInBaseDataArray[0].psData = malloc(bufSize);
	if (NULL == pSenData->inDataClass.pInBaseDataArray[0].psData)
		return -2;
	memset(pSenData->inDataClass.pInBaseDataArray[0].psData, 0, bufSize);

	memset(nodeContent, 0, MAX_JSON_NODE_SIZE);
	JSON_Get(pMote->jsonNode, OBJ_E_SENDATA_SENHUB, nodeContent, sizeof(nodeContent));
	trimBracket(nodeContent);

	snprintf(pSenData->inDataClass.pInBaseDataArray[0].psData, bufSize,
			"%s", nodeContent);

	pSenData->inDataClass.pInBaseDataArray[0].iSizeData = strlen(pSenData->inDataClass.pInBaseDataArray[0].psData);

	// psType = Net
	pSenData->inDataClass.pInBaseDataArray[1].psType = strdup("Net");
	pSenData->inDataClass.pInBaseDataArray[1].iSizeType = sizeof(pSenData->inDataClass.pInBaseDataArray[1].psType);

	bufSize = MAX_SENDATA_LEN;
	pSenData->inDataClass.pInBaseDataArray[1].psData = malloc(bufSize);
	if (NULL == pSenData->inDataClass.pInBaseDataArray[1].psData)
		return -3;
	memset(pSenData->inDataClass.pInBaseDataArray[1].psData, 0, bufSize);

	memset(nodeContent, 0, MAX_JSON_NODE_SIZE);
	JSON_Get(pMote->jsonNode, OBJ_E_NET_HEALTH_SENHUB, nodeContent, sizeof(nodeContent));
	sprintf(health, "%s", nodeContent);
	memset(nodeContent, 0, MAX_JSON_NODE_SIZE);
	sprintf(nodeContent, "0000%s" , g_GatewayMAC);
	memset(neighborList, 0, MAX_JSON_NODE_SIZE);
	sprintf(neighborList, "%s", nodeContent);

	snprintf(pSenData->inDataClass.pInBaseDataArray[1].psData, bufSize,
            SENSOR_DATA_NET_JSON,
            health, neighborList);

	pSenData->inDataClass.pInBaseDataArray[1].iSizeData = strlen(pSenData->inDataClass.pInBaseDataArray[1].psData);

	return 0;
}
