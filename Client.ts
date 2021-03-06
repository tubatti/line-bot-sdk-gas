import * as Line from '@line/bot-sdk';

export class Client {
  private static baseUrl = 'https://api.line.me/v2/bot/';

  constructor(private config: Line.ClientConfig) {}

  public pushMessage(to: string, messages: Line.Message | Line.Message[]): void {
    const messageArray = messages instanceof Array ? messages : [messages];
    UrlFetchApp.fetch(this.pushUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      payload: JSON.stringify({
        messages: messageArray,
        to,
      }),
    });
  }

  public replyMessage(replyToken: string, messages: Line.Message | Line.Message[]): void {
    const messageArray = messages instanceof Array ? messages : [messages];
    UrlFetchApp.fetch(this.replyUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      payload: JSON.stringify({
        messages: messageArray,
        replyToken,
      }),
    });
  }

  public multicast(to: string[], messages: Line.Message | Line.Message[]): void {
    const messageArray = messages instanceof Array ? messages : [messages];
    UrlFetchApp.fetch(this.multicastUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      payload: JSON.stringify({
        messages: messageArray,
        to,
      }),
    });
  }

  public getProfile(userId: string): Line.Profile {
    return JSON.parse(
      UrlFetchApp.fetch(this.userProfileUrl(userId), {
        headers: this.authHeader(),
      }).getContentText()
    ) as Line.Profile;
  }

  public getGroupMemberProfile(groupId: string, userId: string): Line.Profile {
    return JSON.parse(
      UrlFetchApp.fetch(this.groupMemberProfileUrl(groupId, userId), {
        headers: this.authHeader(),
      }).getContentText()
    ) as Line.Profile;
  }

  public getRoomMemberProfile(roomId: string, userId: string): Line.Profile {
    return JSON.parse(
      UrlFetchApp.fetch(this.roomMemberProfileUrl(roomId, userId), {
        headers: this.authHeader(),
      }).getContentText()
    ) as Line.Profile;
  }

  public getProfileWithEventSource(eventSource: Line.EventSource): Line.Profile {
    return JSON.parse(
      UrlFetchApp.fetch(this.profileUrl(eventSource), {
        headers: this.authHeader(),
      }).getContentText()
    ) as Line.Profile;
  }

  public getGroupMemberIds(groupId: string): string[] {
    return JSON.parse(
      UrlFetchApp.fetch(this.groupMemberIdsUrl(groupId), {
        headers: this.authHeader(),
      }).getContentText()
    ) as string[];
  }

  public getRoomMemberIds(roomId: string): string[] {
    return JSON.parse(
      UrlFetchApp.fetch(this.roomMemberIdsUrl(roomId), {
        headers: this.authHeader(),
      }).getContentText()
    ) as string[];
  }

  public getMessageContent(messageId: string): GoogleAppsScript.Base.Blob {
    return UrlFetchApp.fetch(this.contentUrl(messageId), {
      headers: this.authHeader(),
    }).getBlob();
  }

  public leaveGroup(groupId: string): void {
    UrlFetchApp.fetch(this.leaveGroupUrl(groupId), {
      headers: this.authHeader(),
      method: 'post',
    });
  }

  public leaveRoom(roomId: string): void {
    UrlFetchApp.fetch(this.leaveRoomUrl(roomId), {
      headers: this.authHeader(),
      method: 'post',
    });
  }

  public leaveWithEventSource(eventSource: Line.EventSource) {
    UrlFetchApp.fetch(this.leaveUrl(eventSource), {
      headers: this.authHeader(),
      method: 'post',
    });
  }

  public getRichMenu(richMenuId: string): Line.RichMenuResponse {
    return JSON.parse(
      UrlFetchApp.fetch(this.richMenuUrl(richMenuId), {
        headers: this.authHeader(),
      }).getContentText()
    );
  }

  public createRichMenu(richMenu: Line.RichMenu): string {
    return UrlFetchApp.fetch(this.richMenuUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      payload: JSON.stringify(richMenu),
    }).getContentText();
  }

  public deleteRichMenu(richMenuId: string): void {
    UrlFetchApp.fetch(this.richMenuUrl(richMenuId), {
      headers: this.authHeader(),
      method: 'delete',
    });
  }

  public getRichMenuIdOfUser(userId: string): string {
    return UrlFetchApp.fetch(this.userRichMenuUrl(userId), {
      headers: this.authHeader(),
    }).getContentText();
  }

  public linkRichMenuToUser(userId: string, richMenuId: string): void {
    UrlFetchApp.fetch(this.userRichMenuUrl(userId, richMenuId), {
      headers: this.authHeader(),
      method: 'post',
    });
  }

  public unlinkRichMenuFromUser(userId: string): void {
    UrlFetchApp.fetch(this.userRichMenuUrl(userId), {
      headers: this.authHeader(),
      method: 'delete',
    });
  }

  public getRichMenuImage(richMenuId: string): GoogleAppsScript.Base.Blob {
    return UrlFetchApp.fetch(this.richMenuContentUrl(richMenuId), {
      headers: this.authHeader(),
    }).getBlob();
  }

  public setRichMenuImage(
    richMenuId: string,
    data: GoogleAppsScript.Base.Blob,
    contentType?: string
  ): void {
    UrlFetchApp.fetch(this.richMenuContentUrl(richMenuId), {
      contentType,
      headers: this.authHeader(),
      method: 'post',
      payload: data,
    });
  }

  public getRichMenuList(): Line.RichMenuResponse[] {
    return JSON.parse(
      UrlFetchApp.fetch(this.richMenuListUrl(), {
        headers: this.authHeader(),
      }).getContentText()
    ).richmenus as Line.RichMenuResponse[];
  }

  public setDefaultRichMenu(richMenuId: string): void {
    UrlFetchApp.fetch(this.defaultRichMenuUrl(richMenuId), {
      headers: this.authHeader(),
      method: 'post',
    });
  }

  public getDefaultRichMenuId(): string {
    return UrlFetchApp.fetch(this.defaultRichMenuUrl(), {
      headers: this.authHeader(),
    }).getContentText();
  }

  public deleteDefaultRichMenu(): void {
    UrlFetchApp.fetch(this.defaultRichMenuUrl(), {
      headers: this.authHeader(),
      method: 'delete',
    });
  }

  private apiUrl = (path: string): string => `${Client.baseUrl}${path}`;
  private pushUrl = () => this.apiUrl('message/push');
  private replyUrl = () => this.apiUrl('message/reply');
  private multicastUrl = () => this.apiUrl('message/multicast');
  private contentUrl = (messageId: string) => this.apiUrl(`message/${messageId}/content`);
  private userProfileUrl = (userId: string) => this.apiUrl(`profile/${userId}`);
  private roomMemberProfileUrl = (roomId: string, userId: string) =>
    this.apiUrl(`room/${roomId}/member/${userId}`);
  private groupMemberProfileUrl = (groupId: string, userId: string) =>
    this.apiUrl(`group/${groupId}/member/${userId}`);
  private profileUrl = (eventSource: Line.EventSource) => {
    switch (eventSource.type) {
      case 'group':
        return this.groupMemberProfileUrl(eventSource.groupId, eventSource.userId!);
      case 'room':
        return this.roomMemberProfileUrl(eventSource.roomId, eventSource.userId!);
      default:
        return this.userProfileUrl(eventSource.userId);
    }
  };
  private groupMemberIdsUrl = (groupId: string) => this.apiUrl(`group/${groupId}/members/ids`);
  private roomMemberIdsUrl = (roomId: string) => this.apiUrl(`room/${roomId}/members/ids`);
  private leaveGroupUrl = (groupId: string) => this.apiUrl(`group/${groupId}/leave`);
  private leaveRoomUrl = (roomId: string) => this.apiUrl(`room/${roomId}/leave`);
  private leaveUrl = (eventSource: Line.EventSource) => {
    switch (eventSource.type) {
      case 'group':
        return this.leaveGroupUrl(eventSource.groupId);
      case 'room':
        return this.leaveRoomUrl(eventSource.roomId);
      default:
        throw new Error('Unexpected eventSource.type to get leave url.');
    }
  };
  private richMenuUrl = (richMenuId?: string) =>
    this.apiUrl(`richmenu${richMenuId ? `/${richMenuId}` : ''}`);
  private richMenuListUrl = () => this.apiUrl('richmenu/list');
  private userRichMenuUrl = (userId: string, richMenuId?: string) =>
    this.apiUrl(`user/${userId}/richmenu${richMenuId ? `/${richMenuId}` : ''}`);
  private richMenuContentUrl = (richMenuId: string) =>
    this.apiUrl(`richmenu/${richMenuId}/content`);
  private defaultRichMenuUrl = (richMenuId?: string) =>
    this.apiUrl(`user/all/richmenu${richMenuId ? `/${richMenuId}` : ''}`);

  private authHeader = () => {
    return {
      Authorization: `Bearer ${this.config.channelAccessToken}`,
    };
  };
}
