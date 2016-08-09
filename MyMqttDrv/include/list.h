/*
 * Copyright (c) 2016, Advantech Co.,Ltd.
 * All rights reserved.
 * Authur: Chinchen-Lin <chinchen.lin@advantech.com.tw>
 * ChangeLog:
 *  2016/01/18 Chinchen: Initial version
 */

/*
 *  sorted linked list
 */
typedef struct _senhub_list_t
{
	struct _senhub_list_t *next;
	int id;
	char macAddress[16];
} senhub_list_t;

// Add 'node' to the list 'head' and return the new list
senhub_list_t *senhub_list_add(senhub_list_t *head, senhub_list_t *node);

// Return the node with ID 'id' from the list 'head' or NULL if not found
senhub_list_t *senhub_list_find(senhub_list_t *head, int id);

senhub_list_t *senhub_list_find_by_mac(senhub_list_t *head, char *mac);

// Remove the node with ID 'id' from the list 'head' and return the new list
senhub_list_t *senhub_list_remove(senhub_list_t *head, int id, senhub_list_t **nodeP);

// Return the lowest unused ID in the list 'head'
int senhub_list_newId(senhub_list_t *head);

#define SENHUB_LIST_ADD(H,N) senhub_list_add((senhub_list_t *)H, (senhub_list_t *)N);
#define SENHUB_LIST_RM(H,I,N) senhub_list_remove((senhub_list_t *)H, I, (senhub_list_t **)N);
