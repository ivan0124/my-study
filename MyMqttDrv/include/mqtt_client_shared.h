/*
Copyright (c) 2014 Roger Light <roger@atchoo.org>

All rights reserved. This program and the accompanying materials
are made available under the terms of the Eclipse Public License v1.0
and Eclipse Distribution License v1.0 which accompany this distribution.
 
The Eclipse Public License is available at
   http://www.eclipse.org/legal/epl-v10.html
and the Eclipse Distribution License is available at
  http://www.eclipse.org/org/documents/edl-v10.php.
 
Contributors:
   Roger Light - initial implementation and documentation.

ChangeLog:
   2015/12/23 Chinchen: change function name to mqtt_client*
*/

#ifndef _CLIENT_CONFIG_H
#define _CLIENT_CONFIG_H

#include <stdio.h>
#ifndef WIN32
#include <stdbool.h>
#endif

#define VERSION "1.4.5"

/* pub_client.c modes */
#define MSGMODE_NONE 0
#define MSGMODE_CMD 1
#define MSGMODE_STDIN_LINE 2
#define MSGMODE_STDIN_FILE 3
#define MSGMODE_FILE 4
#define MSGMODE_NULL 5

#define CLIENT_PUB 1
#define CLIENT_SUB 2

struct mosq_config {
	char *id;
	char *id_prefix;
	int protocol_version;
	int keepalive;
	char *host;
	int port;
	int qos;
	bool retain;
	int pub_mode; /* pub */
	char *file_input; /* pub */
	char *message; /* pub */
	long msglen; /* pub */
	char *topic; /* pub */
	char *bind_address;
#ifdef WITH_SRV
	bool use_srv;
#endif
	bool debug;
	bool quiet;
	unsigned int max_inflight;
	char *username;
	char *password;
	char *will_topic;
	char *will_payload;
	long will_payloadlen;
	int will_qos;
	bool will_retain;
#ifdef WITH_TLS
	char *cafile;
	char *capath;
	char *certfile;
	char *keyfile;
	char *ciphers;
	bool insecure;
	char *tls_version;
#  ifdef WITH_TLS_PSK
	char *psk;
	char *psk_identity;
#  endif
#endif
	bool clean_session; /* sub */
	char **topics; /* sub */
	int topic_count; /* sub */
	bool no_retain; /* sub */
	char **filter_outs; /* sub */
	int filter_out_count; /* sub */
	bool verbose; /* sub */
	bool eol; /* sub */
	int msg_count; /* sub */
#ifdef WITH_SOCKS
	char *socks5_host;
	int socks5_port;
	char *socks5_username;
	char *socks5_password;
#endif
};

enum mosquitto_client_state {
	mosq_cs_new = 0,
	mosq_cs_connected = 1,
	mosq_cs_disconnecting = 2,
	mosq_cs_connect_async = 3,
	mosq_cs_connect_pending = 4,
	mosq_cs_connect_srv = 5,
	mosq_cs_disconnect_ws = 6,
	mosq_cs_disconnected = 7,
	mosq_cs_socks5_new = 8,
	mosq_cs_socks5_start = 9,
	mosq_cs_socks5_request = 10,
	mosq_cs_socks5_reply = 11,
	mosq_cs_socks5_auth_ok = 12,
	mosq_cs_socks5_userpass_reply = 13,
	mosq_cs_socks5_send_userpass = 14,
	mosq_cs_expiring = 15,
};

int mqtt_client_config_load(struct mosq_config *config, int pub_or_sub, int argc, char *argv[]);
void mqtt_client_config_cleanup(struct mosq_config *cfg);
int mqtt_client_opts_set(struct mosquitto *mosq, struct mosq_config *cfg);
int mqtt_client_id_generate(struct mosq_config *cfg, const char *id_base);
int mqtt_client_connect(struct mosquitto *mosq, struct mosq_config *cfg);

#endif
