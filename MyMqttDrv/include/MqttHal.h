/*
 * Copyright (c) 2016, Advantech Co.,Ltd.
 * All rights reserved.
 * Authur: Chinchen-Lin <chinchen.lin@advantech.com.tw>
 * ChangeLog:
 *  2016/01/18 Chinchen: Initial version
 */

#ifndef _MQTT_HAL_H
#define _MQTT_HAL_H

#include "AdvJSON.h"

//-----------------------------------------------------------------------------
// User API
//-----------------------------------------------------------------------------
#define WA_PUB_CONNECT_TOPIC "agentinfoack"
#define WA_PUB_ACTION_TOPIC  "agentactionreq"
#define WA_PUB_DEVINFO_TOPIC "deviceinfo"
#define WA_PUB_WILL_TOPIC    "willmessage"
#define WA_SUB_CBK_TOPIC     "agentcallbackreq"

#define OBJ_INFO_SPEC              "[susiCommData][infoSpec]"
#define OBJ_IOTGW_INFO_SPEC        "[susiCommData][infoSpec][IoTGW]"
#define OBJ_SENHUB_INFO_SPEC       "[susiCommData][infoSpec][SenHub]"
#define OBJ_NAME_SENHUB_INFO_SPEC  "[susiCommData][infoSpec][SenHub][Info][e][0][sv]"
#define OBJ_DATA                   "[susiCommData][data]"
#define OBJ_IOTGW_DATA             "[susiCommData][data][IoTGW]"
#define OBJ_SENHUB_DATA            "[susiCommData][data][SenHub]"
#define OBJ_DEVICE_TYPE            "[susiCommData][type]"
#define OBJ_DEVICE_MAC             "[susiCommData][mac]"
#define OBJ_DEVICE_HOSTNAME        "[susiCommData][hostname]"
#define OBJ_DEVICE_PRODUCTNAME     "[susiCommData][product]"
#define OBJ_AGENT_ID               "[susiCommData][agentID]"
#define OBJ_STATUS_CODE            "[susiCommData][sensorInfoList][e][0][StatusCode]"
#define OBJ_SESSION_ID             "[susiCommData][sessionID]"
#define OBJ_RESULT_STR             "[susiCommData][result]"
#define OBJ_E_SENDATA_SENHUB       "[SenHub][SenData][e]"
#define OBJ_E_INFO_SENHUB          "[SenHub][Info][e]"
#define OBJ_E_NET_SENHUB           "[SenHub][Net][e]"
#define OBJ_E_NET_HEALTH_SENHUB    "[SenHub][Net][e][0][v]"
#define OBJ_E_NET_NEIGHBORS_SENHUB "[SenHub][Net][e][1][sv]"
#define OBJ_E_NET_SWVER_SENHUB     "[SenHub][Net][e][2][sv]"

#define MAX_HOSTNAME_LEN         32
#define MAX_PRODUCTNAME_LEN	     32
#define MAX_SOFTWAREVERSION_LEN  12	
#define MAX_MACADDRESS_LEN       18	
#define MAX_SENDATA_LEN          256

#define MAX_JSON_NODE_SIZE       1024

#define IFACENAME		"eth0"
#define CONTYPE			"LAN"
#define CONNAME(d)		CONTYPE#d

typedef enum {
	Mote_Report_CMD2000 = 0,
	Mote_Report_CMD2001,
	Mote_Report_CMD2002,
	Mote_Report_CMD2003
} MOTE_REPORT_STATE;

typedef enum {
	Mote_Cmd_None = 0,
	Mote_Cmd_SetSensorValue,
	Mote_Cmd_SetMoteName,
	Mote_Cmd_SetMoteReset,
	Mote_Cmd_SetAutoReport
} MOTE_CMD_TYPE;
	
typedef struct _senhub_info_t {
	struct _senhub_info_t *next;
	int id;                                        // index
	char macAddress[MAX_MACADDRESS_LEN];  // mac address
	char hostName[MAX_HOSTNAME_LEN];               // hostname
	char productName[MAX_PRODUCTNAME_LEN];         // product name
	char softwareVersion[MAX_SOFTWAREVERSION_LEN]; // software version
	int state;                                     // state
	JSONode *jsonNode;                             // json data
} senhub_info_t;


int MqttHal_GetNetworkIntfaceMAC(char *_ifname, char* _ifmac);
int MqttHal_Init();
int MqttHal_Uninit();
void MqttHal_Proc();
void MqttHal_UpdateIntf(int bUpdate);
void MqttHal_GatewayMAC(char* gatewayMac);
int MqttHal_GetMacAddrList(char *pOutBuf, const int outBufLen, int withHead);
senhub_info_t* MqttHal_GetMoteInfoByMac(char *strMacAddr);
int MqttHal_Publish(char *macAddr, int cmdType, char *strName, char *strValue);

#endif // _MQTT_HAL_H
