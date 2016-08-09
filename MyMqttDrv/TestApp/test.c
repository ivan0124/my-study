#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dlfcn.h>
#include "SensorNetwork_API.h"
#include "SensorNetwork_BaseDef.h"
//#include "AdvLog.h"

#define LIB_NAME		"./libMqttDrv.so"
#define SW_VERSION_LEN	16
#define MAX_SENDATA_LEN	256

SN_Initialize_API g_pFunc_SNInit;
SN_Uninitialize_API g_pFunc_SNUninit;
SN_GetVersion_API g_pFunc_SNGetSWVersion;
SN_SetUpdateDataCbf_API g_pFunc_SNSetUpdateCbf;
SN_GetCapability_API g_pFunc_SNGetCapability;
SN_GetData_API g_pFunc_SNGetData;
SN_SetData_API g_pFunc_SNSetData;

#define MANAGER_MAC "00170d00006035dd"
#define MOTE_MAC    "00170d0000582a4f"

int TestGetAPI()
{
	InSenData *pInSenData;
	OutSenData *pOutSenData;

	printf("# Main - %s #\n", __func__);
	// Test data
	pInSenData = (InSenData *)malloc(sizeof(InSenData));
	sprintf(pInSenData->sUID, MANAGER_MAC);
	pInSenData->inDataClass.iTypeCount = 1;
	pInSenData->inDataClass.pInBaseDataArray = (InBaseData *)malloc(sizeof(InBaseData) * pInSenData->inDataClass.iTypeCount);
	pInSenData->inDataClass.pInBaseDataArray[0].psType = strdup("Info");
	pInSenData->inDataClass.pInBaseDataArray[0].iSizeType = sizeof(pInSenData->inDataClass.pInBaseDataArray[0].psType);
	pInSenData->inDataClass.pInBaseDataArray[0].psData = malloc(MAX_SENDATA_LEN);
	if (NULL == pInSenData->inDataClass.pInBaseDataArray[0].psData)
		return -1;
	memset(pInSenData->inDataClass.pInBaseDataArray[0].psData, 0, MAX_SENDATA_LEN);
	snprintf(pInSenData->inDataClass.pInBaseDataArray[0].psData, MAX_SENDATA_LEN,	"{\"n\":\"Health\"}");
	pInSenData->inDataClass.pInBaseDataArray[0].iSizeData = strlen(pInSenData->inDataClass.pInBaseDataArray[0].psData);
	//
	pOutSenData = (OutSenData *)malloc(sizeof(OutSenData));
	pOutSenData->outDataClass.iTypeCount = 1;
	pOutSenData->outDataClass.pOutBaseDataArray = (OutBaseData *)malloc(sizeof(OutBaseData) * pOutSenData->outDataClass.iTypeCount);
	pOutSenData->outDataClass.pOutBaseDataArray[0].psType = strdup("Info");
	pOutSenData->outDataClass.pOutBaseDataArray[0].iSizeType = sizeof(pOutSenData->outDataClass.pOutBaseDataArray[0].psType);

	pOutSenData->outDataClass.pOutBaseDataArray[0].psData = malloc(32);
	if (NULL == pOutSenData->outDataClass.pOutBaseDataArray[0].psData)
		return ;
	memset(pOutSenData->outDataClass.pOutBaseDataArray[0].psData, 0, 32);
	pOutSenData->outDataClass.pOutBaseDataArray[0].iSizeData = malloc(sizeof(int));
	*pOutSenData->outDataClass.pOutBaseDataArray[0].iSizeData = 32;
	
	if (g_pFunc_SNGetData(SN_Inf_Get, pInSenData, pOutSenData) == -1) {
		printf("Error: Lib set data\n");
	}

	memset(pInSenData->sUID, 0, sizeof(pInSenData->sUID));
	sprintf(pInSenData->sUID, MOTE_MAC);
	memset(pInSenData->inDataClass.pInBaseDataArray[0].psData, 0, MAX_SENDATA_LEN);
	snprintf(pInSenData->inDataClass.pInBaseDataArray[0].psData, MAX_SENDATA_LEN,	"{\"n\":\"Name\"}");
	if (g_pFunc_SNGetData(SN_SenHub_Get, pInSenData, pOutSenData) == -1) {
		printf("Error: Lib set data\n");
	}
	printf("##########\n");
}

int TestSetAPI()
{
	InSenData *pInSenData;
	OutSenData *pOutSenData;

	printf("# Main - %s #\n", __func__);
	// Test data
	pInSenData = (InSenData *)malloc(sizeof(InSenData));
	sprintf(pInSenData->sUID, MOTE_MAC);
	pInSenData->inDataClass.iTypeCount = 1;
	pInSenData->inDataClass.pInBaseDataArray = (InBaseData *)malloc(sizeof(InBaseData) * pInSenData->inDataClass.iTypeCount);
	pInSenData->inDataClass.pInBaseDataArray[0].psType = strdup("Info");
	pInSenData->inDataClass.pInBaseDataArray[0].iSizeType = sizeof(pInSenData->inDataClass.pInBaseDataArray[0].psType);
	pInSenData->inDataClass.pInBaseDataArray[0].psData = malloc(MAX_SENDATA_LEN);
	if (NULL == pInSenData->inDataClass.pInBaseDataArray[0].psData)
		return -1;
	memset(pInSenData->inDataClass.pInBaseDataArray[0].psData, 0, MAX_SENDATA_LEN);
	snprintf(pInSenData->inDataClass.pInBaseDataArray[0].psData, MAX_SENDATA_LEN,	"{\"n\":\"reset\",\"bv\":1}");
	pInSenData->inDataClass.pInBaseDataArray[0].iSizeData = strlen(pInSenData->inDataClass.pInBaseDataArray[0].psData);
	//
	pOutSenData = (OutSenData *)malloc(sizeof(OutSenData));
	pOutSenData->outDataClass.iTypeCount = 1;
	pOutSenData->outDataClass.pOutBaseDataArray = (OutBaseData *)malloc(sizeof(OutBaseData) * pOutSenData->outDataClass.iTypeCount);
	pOutSenData->outDataClass.pOutBaseDataArray[0].psType = strdup("Info");
	pOutSenData->outDataClass.pOutBaseDataArray[0].iSizeType = sizeof(pOutSenData->outDataClass.pOutBaseDataArray[0].psType);

	pOutSenData->outDataClass.pOutBaseDataArray[0].psData = malloc(32);
	if (NULL == pOutSenData->outDataClass.pOutBaseDataArray[0].psData)
		return ;
	memset(pOutSenData->outDataClass.pOutBaseDataArray[0].psData, 0, 32);
	pOutSenData->outDataClass.pOutBaseDataArray[0].iSizeData = malloc(sizeof(int));
	*pOutSenData->outDataClass.pOutBaseDataArray[0].iSizeData = 32;
	
#if 1
	if (g_pFunc_SNSetData(SN_SenHub_Set, pInSenData, pOutSenData) == -1) {
		printf("Error: Lib set data\n");
	}
#endif
	printf("##########\n");

}

UpdateSNDataCbf printSNcallbackData(const int cmdId, const void *pInData, const int InDatalen, void *pUserData,	void *pOutParam, void *pRev1, void *pRev2)
{
	printf("\n# Main - Receive Callback Data: #\n");
	printf("\t CmdId=%d\n", cmdId);
	//printf("\t Data=%s\n", pMsgBuf);
	switch (cmdId) {
		case SN_Inf_UpdateInterface_Data: {
			SNInterfaceData *pSNInfData = (SNInterfaceData *) pInData;
			printf("\t sComType=%s, sInfID=%s\n", pSNInfData->sComType, pSNInfData->sInfID);
			break;
		}
		// 2000
		case SN_SenHub_Register: {
			SenHubInfo *pSenHubInfo = (SenHubInfo *) pInData;
			printf("\t sUID=%s, sHostName=%s, sSN=%s, sProduct=%s\n", pSenHubInfo->sUID, pSenHubInfo->sHostName, pSenHubInfo->sSN, pSenHubInfo->sProduct);
			break;
		}
		// 2001
		case SN_SenHub_SendInfoSpec: {
			int i;
			InSenData *pSenInfoSpec = (InSenData *) pInData;
			printf("\t sUID=%s TypeCount=%d\n", pSenInfoSpec->sUID, pSenInfoSpec->inDataClass.iTypeCount);
			if (pSenInfoSpec->inDataClass.pInBaseDataArray!=NULL && pSenInfoSpec->inDataClass.iTypeCount>0) {
				for(i=0; i<pSenInfoSpec->inDataClass.iTypeCount; i++) {
					printf("\t iSizeType=%d, psType=%s, iSizeSenData=%d\n", 
							pSenInfoSpec->inDataClass.pInBaseDataArray[i].iSizeType, 
							pSenInfoSpec->inDataClass.pInBaseDataArray[i].psType, 
							pSenInfoSpec->inDataClass.pInBaseDataArray[i].iSizeData);
					printf("\t psSenData=%s\n", pSenInfoSpec->inDataClass.pInBaseDataArray[i].psData);
				}
			}
			break;
		}
		// 2002
		case SN_SenHub_AutoReportData:
		// 2003
		case SN_SenHub_Disconnect: {
			int i;
			InSenData *pSenData = (InSenData *) pInData;
			printf("\t sUID=%s TypeCount=%d\n", pSenData->sUID, pSenData->inDataClass.iTypeCount);
			if (pSenData->inDataClass.pInBaseDataArray!=NULL && pSenData->inDataClass.iTypeCount>0) {
				for(i=0; i<pSenData->inDataClass.iTypeCount; i++) {
					printf("\t iSizeType=%d, psType=%s, iSizeSenData=%d\n",
							pSenData->inDataClass.pInBaseDataArray[i].iSizeType,
						   	pSenData->inDataClass.pInBaseDataArray[i].psType,
						   	pSenData->inDataClass.pInBaseDataArray[i].iSizeData);
					printf("\t psSenData=%s\n", pSenData->inDataClass.pInBaseDataArray[i].psData);
				}
			}
			break;
		}
		default:
			printf("Unknown cmdId=%d\n", cmdId);
			break;
	}
	printf("\n");

	//TestGetAPI();
	//TestSetAPI();
	
	printf("##########\n");
	return 0;
}

int printSNInfInfos(SNInfInfos *pSNInfos)
{
	int i;
	printf("# Main - Got SNInfInfos: #\n\t sComType=%s\n\t iNum=%d\n", pSNInfos->sComType, pSNInfos->iNum);
	for (i=0; i<pSNInfos->iNum; i++) {
		printf("\t SNInfs[%d].sInfName=%s\n", i, pSNInfos->SNInfs[i].sInfName);
		printf("\t SNInfs[%d].sInfID=%s\n", i, pSNInfos->SNInfs[i].sInfID);
	}
	printf("##########\n");
	
	return 0;
}


int Start()
{
	void *pLibHandle = NULL;	
	char *pSWVersion = NULL;
	SNInfInfos outSNInfInfo;

	pLibHandle = dlopen(LIB_NAME, RTLD_LAZY);
	if (NULL == pLibHandle) {
		printf("Error: Failed to load %s\n", LIB_NAME);
		return -1;
	}
	g_pFunc_SNInit			= (SN_Initialize_API) dlsym(pLibHandle, "SN_Initialize");
	g_pFunc_SNUninit		= (SN_Uninitialize_API) dlsym(pLibHandle, "SN_Uninitialize");
	g_pFunc_SNGetCapability	= (SN_GetCapability_API) dlsym(pLibHandle, "SN_GetCapability");
	g_pFunc_SNSetUpdateCbf	= (SN_SetUpdateDataCbf_API) dlsym(pLibHandle, "SN_SetUpdateDataCbf");
	g_pFunc_SNGetSWVersion	= (SN_GetVersion_API) dlsym(pLibHandle, "SN_GetVersion");
	g_pFunc_SNGetData	= (SN_GetData_API) dlsym(pLibHandle, "SN_GetData");
	g_pFunc_SNSetData	= (SN_SetData_API) dlsym(pLibHandle, "SN_SetData");

	if (NULL==g_pFunc_SNInit || NULL==g_pFunc_SNUninit || 
		NULL==g_pFunc_SNGetCapability || NULL==g_pFunc_SNSetUpdateCbf ||
		NULL==g_pFunc_SNGetSWVersion || NULL== g_pFunc_SNGetData || NULL==g_pFunc_SNSetData) {
		printf("Error: Function load error from %s\n", LIB_NAME);
		return -1;
	}

	if (g_pFunc_SNInit(NULL) == -1) {
		printf("Error: Lib init\n");
		return -1;
	}

	pSWVersion = malloc(sizeof(char)*SW_VERSION_LEN);
	if (g_pFunc_SNGetSWVersion(pSWVersion, sizeof(char)*SW_VERSION_LEN) == -1) {
		printf("Error: Lib get sw version\n");
		return -1;
	}

	printf("%s: SW Version=%s\n", __func__, pSWVersion);

	if (g_pFunc_SNSetUpdateCbf((UpdateSNDataCbf) printSNcallbackData) == -1) {
		printf("Error: Lib set CBF\n");
		return -1;
	}

	//sleep(1);
	outSNInfInfo.iNum = 2;
	outSNInfInfo.SNInfs[0].outDataClass.iTypeCount = 1;
	outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray = (OutBaseData *)malloc(sizeof(OutBaseData));
	outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray->iSizeType = 256;
	outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray->psType = (char *)malloc(256);
	outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray->iSizeData = (int *)malloc(sizeof(int));
	*(outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray->iSizeData) = 256;
	outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray->psData = (char *)malloc(256);
	outSNInfInfo.SNInfs[1].outDataClass.iTypeCount = 1;
	outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray = (OutBaseData *)malloc(sizeof(OutBaseData));
	outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray->iSizeType = 256;
	outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray->psType = (char *)malloc(256);
	outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray->iSizeData = (int *)malloc(sizeof(int));
	*(outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray->iSizeData) = 256;
	outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray->psData = (char *)malloc(256);

	if (g_pFunc_SNGetCapability(&outSNInfInfo) == -1) {
		printf("Error: Lib get capability\n");
	} else {
		printSNInfInfos(&outSNInfInfo);
		usleep(1000);
	}

	free(outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray->psType);
	free(outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray->iSizeData);
	free(outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray->psData);
	free(outSNInfInfo.SNInfs[0].outDataClass.pOutBaseDataArray);
	
	free(outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray->psType);
	free(outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray->iSizeData);
	free(outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray->psData);
	free(outSNInfInfo.SNInfs[1].outDataClass.pOutBaseDataArray);

	if(pSWVersion != NULL)
		free(pSWVersion);

	return 0;
}

int main(int argc, char *argv[])
{
	//AdvLog_Init();
	//AdvLog_Arg(argc, argv);

	Start();
	do {
		sleep(1);
	} while (1);



	return 0;
}
