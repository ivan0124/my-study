/*
 * Copyright (c) 2016, Advantech Co.,Ltd.
 * All rights reserved.
 * Authur: Chinchen-Lin <chinchen.lin@advantech.com.tw>
 * ChangeLog:
 *  2016/01/18 Chinchen: Initial version
 */

#ifndef _SENSORNETWORK_API_EX_H
#define _SENSORNETWORK_API_EX_H

int UpdateCbf_IsSet(void);
int GatewayIntf_Update(void);
int SensorHub_Register(senhub_info_t *pMote);
int SensorHub_InfoSpec(senhub_info_t *pMote);
int SensorHub_Data(senhub_info_t *pMote);
int SensorHub_DisConn(senhub_info_t *pMote);

#endif // _SENSORNETWORK_API_EX_H
