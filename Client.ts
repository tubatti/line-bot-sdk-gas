import * as Line from '@line/bot-sdk';
import * as Types from "./types";

export class Client {
  private static baseUrl = 'https://api.line.me/v2/bot/';

  constructor(private config: Line.ClientConfig) {}

  public pushMessage(to: string, messages: Line.Message | Line.Message[]): string {
    const messageArray = messages instanceof Array ? messages : [messages];
    return UrlFetchApp.fetch(this.pushUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        messages: messageArray,
        to,
      }),
    }).getContentText();
  }

  public replyMessage(replyToken: string, messages: Line.Message | Line.Message[]): string {
    const messageArray = messages instanceof Array ? messages : [messages];
    return UrlFetchApp.fetch(this.replyUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        messages: messageArray,
        replyToken,
      }),
    }).getContentText();
  }

  public multicast(to: string[], messages: Line.Message | Line.Message[]): string {
    const messageArray = messages instanceof Array ? messages : [messages];
    return UrlFetchApp.fetch(this.multicastUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        messages: messageArray,
        to,
      }),
    }).getContentText();
  }

  public broadcast(messages: Line.Message | Line.Message[], notificationDisabled: boolean = false): string {
    const messageArray = messages instanceof Array ? messages : [messages];
    return UrlFetchApp.fetch(this.broadcastUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        messages: messageArray,
        notificationDisabled,
      }),
    }).getContentText();
  }

  /**
   * ナローキャストメッセージ送信
   * https://developers.line.biz/ja/reference/messaging-api/#send-narrowcast-message
   * @param {NarrowcastRequestBody} requestBody
   * @returns リクエストID・レスポンスコード・レスポンスボディ
   */
  public narrowcast(requestBody: Types.NarrowcastRequestBody) {
    requestBody.messages = requestBody.messages instanceof Array ? requestBody.messages : [requestBody.messages];
    const res = UrlFetchApp.fetch(this.narrowcastUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
      payload: JSON.stringify(requestBody),
    });
    const header: Line.MessageAPIResponseBase = res.getHeaders();
    const requestId: string | undefined = header['x-line-request-id'];
    const contentText: string = res.getContentText();
    const code: number = res.getResponseCode();
    return {requestId, code, contentText};
  }

  /**
   * ナローキャストメッセージの進行状況を取得
   * https://developers.line.biz/ja/reference/messaging-api/#get-narrowcast-progress-status
   * @param requestId 
   */
  public getNarrowcastProgress(requestId: string) {
    const res = UrlFetchApp.fetch(this.getNarrowcastProgressUrl(requestId), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'get',
      muteHttpExceptions: true,
    });
    const body: Types.NarrowcastProgressResponse = JSON.parse(res.getContentText());
    const code: number = res.getResponseCode();
    return {code, body};
  }

  /**
   * ユーザーIDアップロード用のオーディエンスを作成
   * https://developers.line.biz/ja/reference/messaging-api/#create-upload-audience-group
   * @param uploadAudienceGroup 
   */
  public createUploadAudienceGroup(uploadAudienceGroup: Types.CreateUploadAudienceGroupRequestBody): string {
    return UrlFetchApp.fetch(this.createUploadAudienceGroupUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
      payload: JSON.stringify(uploadAudienceGroup),
    }).getContentText();
  }

  /**
   * ユーザーIDアップロード用のオーディエンスにユーザーIDまたはIFAを追加
   * https://developers.line.biz/ja/reference/messaging-api/#update-upload-audience-group
   * @param uploadAudienceGroup 
   */
  public updateUploadAudienceGroup(uploadAudienceGroup: Types.updateUploadAudienceGroupRequestBody): string {
    return UrlFetchApp.fetch(this.updateUploadAudienceGroupUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'put',
      muteHttpExceptions: true,
      payload: JSON.stringify(uploadAudienceGroup),
    }).getContentText();
  }

  /**
   * クリックリターゲティング用のオーディエンスを作成
   * https://developers.line.biz/ja/reference/messaging-api/#create-click-audience-group
   * @param clickAudienceGroup 
   */
  public createClickAudienceGroup(clickAudienceGroup: {
    description: string;
    requestId: string;
    clickUrl?: string;
  }): string {

    return UrlFetchApp.fetch(this.createClickAudienceGroupUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
      payload: JSON.stringify(clickAudienceGroup),
    }).getContentText();    
  }

  /**
   * インプレッションリターゲティング用のオーディエンスを作成
   * https://developers.line.biz/ja/reference/messaging-api/#create-imp-audience-group
   * @param impAudienceGroup 
   */
  public createImpAudienceGroup(impAudienceGroup: {
    requestId: string;
    description: string;
  }): string {

    return UrlFetchApp.fetch(this.createImpAudienceGroupUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
      payload: JSON.stringify(impAudienceGroup),
    }).getContentText();    
  }

  /**
   * オーディエンスの名前を更新
   * https://developers.line.biz/ja/reference/messaging-api/#set-description-audience-group
   * @param description 
   * @param audienceGroupId 
   */
  public setDescriptionAudienceGroup(
    description: string,
    audienceGroupId: string,
  ): string {

    return UrlFetchApp.fetch(this.setDescriptionAudienceGroupUrl(audienceGroupId), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'put',
      muteHttpExceptions: true,
      payload: JSON.stringify({description}),
    }).getContentText();
  }

  /**
   * オーディエンスを削除
   * https://developers.line.biz/ja/reference/messaging-api/#delete-audience-group
   * @param audienceGroupId 
   */
  public deleteAudienceGroup(audienceGroupId: string): string {
    return UrlFetchApp.fetch(this.deleteAudienceGroupUrl(audienceGroupId), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'delete',
      muteHttpExceptions: true,
    }).getContentText();
  }

  /**
   * オーディエンスの情報を取得
   * https://developers.line.biz/ja/reference/messaging-api/#get-audience-group
   * @param audienceGroupId 
   */
  public getAudienceGroup(audienceGroupId: string): string {
    return UrlFetchApp.fetch(this.getAudienceGroupUrl(audienceGroupId), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'get',
      muteHttpExceptions: true,
    }).getContentText();
  }

  /**
   * 複数のオーディエンスの情報を取得
   * https://developers.line.biz/ja/reference/messaging-api/#get-audience-groups
   * @param {Types.GetAudienceGroupsQueryParam} クエリーパラメタ
   * @returns {Types.GetAudienceGroupsResponseBody} レスポンスボディ
   */
  public getAudienceGroups(queryParam: Types.GetAudienceGroupsQueryParam): Types.GetAudienceGroupsResponseBody {
    const res: string = UrlFetchApp.fetch(this.getAudienceGroupsUrl(queryParam), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'get',
      muteHttpExceptions: true,
    }).getContentText();
    return JSON.parse(res);
  }

  /**
   * オーディエンスの権限レベルを取得
   * https://developers.line.biz/ja/reference/messaging-api/#get-authority-level
   */
  public getAudienceGroupAuthorityLevel(): string {
    return UrlFetchApp.fetch(this.getAudienceGroupAuthorityLevelUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'get',
      muteHttpExceptions: true,
    }).getContentText();
  }

  /**
   * オーディエンスの権限レベルを変更
   * https://developers.line.biz/ja/reference/messaging-api/#change-authority-level
   * @param authorityLevel 
   */
  public changeAudienceGroupAuthorityLevel(authorityLevel: Types.AudienceGroupAuthorityLevel): string {
    return UrlFetchApp.fetch(this.changeAudienceGroupAuthorityLevelUrl(), {
      contentType: 'application/json',
      headers: this.authHeader(),
      method: 'put',
      muteHttpExceptions: true,
      payload: JSON.stringify({authorityLevel}),
    }).getContentText();
  }

  public getProfile(userId: string): Line.Profile {
    return JSON.parse(
      UrlFetchApp.fetch(this.userProfileUrl(userId), {
        headers: this.authHeader(),
        muteHttpExceptions: true,
      }).getContentText()
    ) as Line.Profile;
  }

  public getGroupMemberProfile(groupId: string, userId: string): Line.Profile {
    return JSON.parse(
      UrlFetchApp.fetch(this.groupMemberProfileUrl(groupId, userId), {
        headers: this.authHeader(),
        muteHttpExceptions: true,
      }).getContentText()
    ) as Line.Profile;
  }

  public getRoomMemberProfile(roomId: string, userId: string): Line.Profile {
    return JSON.parse(
      UrlFetchApp.fetch(this.roomMemberProfileUrl(roomId, userId), {
        headers: this.authHeader(),
        muteHttpExceptions: true,
      }).getContentText()
    ) as Line.Profile;
  }

  public getProfileWithEventSource(eventSource: Line.EventSource): Line.Profile {
    return JSON.parse(
      UrlFetchApp.fetch(this.profileUrl(eventSource), {
        headers: this.authHeader(),
        muteHttpExceptions: true,
      }).getContentText()
    ) as Line.Profile;
  }

  public getGroupMemberIds(groupId: string): string[] {
    return JSON.parse(
      UrlFetchApp.fetch(this.groupMemberIdsUrl(groupId), {
        headers: this.authHeader(),
        muteHttpExceptions: true,
      }).getContentText()
    ) as string[];
  }

  public getRoomMemberIds(roomId: string): string[] {
    return JSON.parse(
      UrlFetchApp.fetch(this.roomMemberIdsUrl(roomId), {
        headers: this.authHeader(),
        muteHttpExceptions: true,
      }).getContentText()
    ) as string[];
  }

  public getMessageContent(messageId: string): GoogleAppsScript.Base.Blob {
    return UrlFetchApp.fetch(this.contentUrl(messageId), {
      headers: this.authHeader(),
      muteHttpExceptions: true,
    }).getBlob();
  }

  public leaveGroup(groupId: string): void {
    UrlFetchApp.fetch(this.leaveGroupUrl(groupId), {
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
    });
  }

  public leaveRoom(roomId: string): void {
    UrlFetchApp.fetch(this.leaveRoomUrl(roomId), {
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
    });
  }

  public leaveWithEventSource(eventSource: Line.EventSource) {
    UrlFetchApp.fetch(this.leaveUrl(eventSource), {
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
    });
  }

  public getRichMenu(richMenuId: string): Line.RichMenuResponse {
    return JSON.parse(
      UrlFetchApp.fetch(this.richMenuUrl(richMenuId), {
        headers: this.authHeader(),
        muteHttpExceptions: true,
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
      muteHttpExceptions: true,
    });
  }

  public getRichMenuIdOfUser(userId: string): string {
    return UrlFetchApp.fetch(this.userRichMenuUrl(userId), {
      headers: this.authHeader(),
      muteHttpExceptions: true,
    }).getContentText();
  }

  public linkRichMenuToUser(userId: string, richMenuId: string): void {
    UrlFetchApp.fetch(this.userRichMenuUrl(userId, richMenuId), {
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
    });
  }

  public unlinkRichMenuFromUser(userId: string): void {
    UrlFetchApp.fetch(this.userRichMenuUrl(userId), {
      headers: this.authHeader(),
      method: 'delete',
      muteHttpExceptions: true,
    });
  }

  public getRichMenuImage(richMenuId: string): GoogleAppsScript.Base.Blob {
    return UrlFetchApp.fetch(this.richMenuContentUrl(richMenuId), {
      headers: this.authHeader(),
      muteHttpExceptions: true,
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
      muteHttpExceptions: true,
      payload: data,
    });
  }

  public getRichMenuList(): Line.RichMenuResponse[] {
    return JSON.parse(
      UrlFetchApp.fetch(this.richMenuListUrl(), {
        headers: this.authHeader(),
        muteHttpExceptions: true,
      }).getContentText()
    ).richmenus as Line.RichMenuResponse[];
  }

  public setDefaultRichMenu(richMenuId: string): void {
    UrlFetchApp.fetch(this.defaultRichMenuUrl(richMenuId), {
      headers: this.authHeader(),
      method: 'post',
      muteHttpExceptions: true,
    });
  }

  public getDefaultRichMenuId(): string {
    return UrlFetchApp.fetch(this.defaultRichMenuUrl(), {
      headers: this.authHeader(),
      muteHttpExceptions: true,
    }).getContentText();
  }

  public deleteDefaultRichMenu(): void {
    UrlFetchApp.fetch(this.defaultRichMenuUrl(), {
      headers: this.authHeader(),
      method: 'delete',
      muteHttpExceptions: true,
    });
  }

  private apiUrl = (path: string): string => `${Client.baseUrl}${path}`;
  private pushUrl = () => this.apiUrl('message/push');
  private replyUrl = () => this.apiUrl('message/reply');
  private multicastUrl = () => this.apiUrl('message/multicast');
  private broadcastUrl = () => this.apiUrl('message/broadcast');
  private narrowcastUrl = () => this.apiUrl('message/narrowcast');
  private getNarrowcastProgressUrl = (requestId: string) => this.apiUrl(`message/progress/narrowcast?requestId=${requestId}`);
  private createUploadAudienceGroupUrl = () => this.apiUrl('audienceGroup/upload');
  private updateUploadAudienceGroupUrl = () => this.apiUrl('audienceGroup/upload');
  private createClickAudienceGroupUrl = () => this.apiUrl('audienceGroup/click');
  private createImpAudienceGroupUrl = () => this.apiUrl('audienceGroup/imp');
  private setDescriptionAudienceGroupUrl = (audienceGroupId: string) => this.apiUrl(`audienceGroup/${audienceGroupId}/updateDescription`);
  private deleteAudienceGroupUrl = (audienceGroupId: string) => this.apiUrl(`audienceGroup/${audienceGroupId}`);
  private getAudienceGroupUrl = (audienceGroupId: string) => this.apiUrl(`audienceGroup/${audienceGroupId}`);
  private getAudienceGroupsUrl = (params: { [s: string]: unknown; }) => this.apiUrl(`audienceGroup/list?${Object.entries(params).map((e) => `${e[0]}=${e[1]}`).join('=')}`);
  private getAudienceGroupAuthorityLevelUrl = () => this.apiUrl('audienceGroup/authorityLevel');
  private changeAudienceGroupAuthorityLevelUrl = () => this.apiUrl('audienceGroup/authorityLevel');
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
