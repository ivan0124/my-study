/*
 * Copyright (c) 2016, Advantech Co.,Ltd.
 * All rights reserved.
 * Authur: Chinchen-Lin <chinchen.lin@advantech.com.tw>
 * ChangeLog:
 *  2016/01/18 Chinchen: Initial version
 */

#include <stdio.h>
#include <string.h>

#include "list.h"

senhub_list_t *senhub_list_add(senhub_list_t *head, senhub_list_t *node)
{
    senhub_list_t *target;

    if (NULL == head) return node;

    if (head->id > node->id) {
        node->next = head;
        return node;
    }

    target = head;
    while (NULL != target->next && target->next->id < node->id) {
        target = target->next;
    }

    node->next = target->next;
    target->next = node;

    return head;
}


senhub_list_t *senhub_list_find(senhub_list_t *head, int id)
{
    while (NULL != head && head->id < id) {
        head = head->next;
    }

    if (NULL != head && head->id == id) return head;

    return NULL;
}

senhub_list_t *senhub_list_find_by_mac(senhub_list_t *head, char *mac)
{
    while (NULL != head) {
		//printf("%s: mac: %s - %s\n", __func__, mac, head->macAddress);
    	if(strcmp(head->macAddress, mac) == 0) {
			//printf("%s: Found mac: %s\n", __func__, mac);
			return head;
		}
        head = head->next;
    }
	//printf("%s: not Found mac: %s\n", __func__, mac);

    return NULL;
}

senhub_list_t *senhub_list_remove(senhub_list_t *head, int id, senhub_list_t **nodeP)
{
    senhub_list_t *target;

    if (head == NULL) {
        *nodeP = NULL;
        return NULL;
    }

    if (head->id == id) {
        *nodeP = head;
        return head->next;
    }

    target = head;
    while (NULL != target->next && target->next->id < id) {
        target = target->next;
    }

    if (NULL != target->next && target->next->id == id) {
        *nodeP = target->next;
        target->next = target->next->next;
    } else {
        *nodeP = NULL;
    }

    return head;
}

int senhub_list_newId(senhub_list_t *head)
{
    int id;
    senhub_list_t *target;

    id = 0;
    target = head;

    while (target != NULL && id == target->id) {
        id = target->id + 1;
        target = target->next;
    }

    return id;
}
