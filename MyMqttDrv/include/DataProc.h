/*
 * Copyright (c) 2016, Advantech Co.,Ltd.
 * All rights reserved.
 * Authur: Chinchen-Lin <chinchen.lin@advantech.com.tw>
 * ChangeLog:
 *  2016/01/18 Chinchen: Initial version
 */

#ifndef _DATA_PROC_H
#define _DATA_PROC_H

#include "SensorNetwork_API.h"

void freeSNInfData(SNInterfaceData *pSNInfData);
void freeSenInfoSpec(InSenData *pSenInfo);
void freeSenData(InSenData *pSenData);

void fillSNInfInfos(SNInfInfos *pSNInfInfos);
int fillSNInfData(SNInterfaceData *pSNInfData);
int fillSenHubInfo(SenHubInfo *pNodeInfo, senhub_info_t *pMote);
int fillSenInfoSpec(InSenData *pSenData, senhub_info_t *pMote);
int fillSenData(InSenData *pSenData, senhub_info_t *pMote);

#endif // _DATA_PROC_H
