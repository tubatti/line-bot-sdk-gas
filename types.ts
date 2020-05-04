import * as Line from '@line/bot-sdk';

/**
 * line-bot-sdk-nodejs/types.ts at master · line/line-bot-sdk-nodejs
 * https://github.com/line/line-bot-sdk-nodejs/blob/master/lib/types.ts
 */

type FilterOperatorObject<T> = {
    type: "operator";
  } & (
    | {
        and: (T | FilterOperatorObject<T>)[];
      }
    | {
        or: (T | FilterOperatorObject<T>)[];
      }
    | {
        not: T | (T | FilterOperatorObject<T>)[];
      }
  );
  
type AudienceObject = {
    type: "audience";
    audienceGroupId: number;
};
  
export type ReceieptObject =
    | AudienceObject
    | FilterOperatorObject<AudienceObject>;

type DemographicAge =
    | "age_15"
    | "age_20"
    | "age_25"
    | "age_30"
    | "age_35"
    | "age_40"
    | "age_45"
    | "age_50";

type DemographicSubscriptionPeriod =
    | "day_7"
    | "day_30"
    | "day_90"
    | "day_180"
    | "day_365";

type DemographicArea =
    | "jp_01"
    | "jp_02"
    | "jp_03"
    | "jp_04"
    | "jp_05"
    | "jp_06"
    | "jp_07"
    | "jp_08"
    | "jp_09"
    | "jp_10"
    | "jp_11"
    | "jp_12"
    | "jp_13"
    | "jp_14"
    | "jp_15"
    | "jp_16"
    | "jp_17"
    | "jp_18"
    | "jp_19"
    | "jp_20"
    | "jp_21"
    | "jp_22"
    | "jp_23"
    | "jp_24"
    | "jp_25"
    | "jp_26"
    | "jp_27"
    | "jp_28"
    | "jp_29"
    | "jp_30"
    | "jp_31"
    | "jp_32"
    | "jp_33"
    | "jp_34"
    | "jp_35"
    | "jp_36"
    | "jp_37"
    | "jp_38"
    | "jp_39"
    | "jp_40"
    | "jp_41"
    | "jp_42"
    | "jp_43"
    | "jp_44"
    | "jp_45"
    | "jp_46"
    | "jp_47"
    | "tw_01"
    | "tw_02"
    | "tw_03"
    | "tw_04"
    | "tw_05"
    | "tw_06"
    | "tw_07"
    | "tw_08"
    | "tw_09"
    | "tw_10"
    | "tw_11"
    | "tw_12"
    | "tw_13"
    | "tw_14"
    | "tw_15"
    | "tw_16"
    | "tw_17"
    | "tw_18"
    | "tw_19"
    | "tw_20"
    | "tw_21"
    | "tw_22"
    | "th_01"
    | "th_02"
    | "th_03"
    | "th_04"
    | "th_05"
    | "th_06"
    | "th_07"
    | "th_08"
    | "id_01"
    | "id_02"
    | "id_03"
    | "id_04"
    | "id_06"
    | "id_07"
    | "id_08"
    | "id_09"
    | "id_10"
    | "id_11"
    | "id_12"
    | "id_05";

type DemographicObject =
    | {
        type: "gender";
        oneOf: ("male" | "female")[];
    }
    | {
        type: "age";
        gte?: DemographicAge;
        lt?: DemographicAge;
    }
    | {
        type: "appType";
        oneOf: ("ios" | "android")[];
    }
    | {
        type: "area";
        oneOf: DemographicArea[];
    }
    | {
        type: "subscriptionPeriod";
        gte?: DemographicSubscriptionPeriod;
        lt?: DemographicSubscriptionPeriod;
    };

export type DemographicFilterObject =
    | DemographicObject
    | FilterOperatorObject<DemographicObject>;

export type NarrowcastProgressResponse = (
    | {
        phase: "waiting";
    }
    | ((
        | {
            phase: "sending" | "succeeded";
        }
        | {
            phase: "failed";
            failedDescription: string;
        }
    ) & {
        successCount: number;
        failureCount: number;
        targetCount: string;
    })
) & {
    errorCode?: 1 | 2;
};

type AudienceGroupJob = {
    audienceGroupJobId: number;
    audienceGroupId: number;
    description: string;
    type: "DIFF_ADD";
    audienceCount: number;
    created: number;
} & (
        | {
            jobStatus: "QUEUED" | "WORKING" | "FINISHED";
        }
        | {
            jobStatus: "FAILED";
            failedType: "INTERNAL_ERROR";
        }
    );

export type AudienceGroupStatus =
    | "IN_PROGRESS"
    | "READY"
    | "EXPIRED"
    | "FAILED";

export type AudienceGroupCreateRoute = "OA_MANAGER" | "MESSAGING_API";

type _AudienceGroup = {
    audienceGroupId: number;
    description: string;
    audienceCount: number;
    created: number;
    isIfaAudience: boolean;
    permission: "READ" | "READ_WRITE";
    createRoute: AudienceGroupCreateRoute;
} & (
        | {
            status: Exclude<AudienceGroupStatus, "FAILED">;
        }
        | {
            status: "FAILED";
            failedType: "AUDIENCE_GROUP_AUDIENCE_INSUFFICIENT" | "INTERNAL_ERROR";
        }
    ) &
    (
        | {
            type: "UPLOAD";
        }
        | {
            type: "CLICK";
            clickUrl: string;
        }
        | {
            type: "IMP";
            requestId: string;
        }
    );

export type AudienceGroup = _AudienceGroup & {
    jobs: AudienceGroupJob[];
};

export type AudienceGroups = _AudienceGroup[];

export type AudienceGroupAuthorityLevel = "PUBLIC" | "PRIVATE";


/**
 * 渡辺が独自に追加
 */
export type GetAudienceGroupsQueryParam = {
    page: number;
    description?: string;
    status?: AudienceGroupStatus;
    size?: number;
    createRoute?: AudienceGroupCreateRoute;
    includesExternalPublicGroups?: boolean;
}

export type GetAudienceGroupsResponseBody = {
    audienceGroups: AudienceGroups;
    hasNextPage: boolean;
    totalCount: number;
    readWriteAudienceGroupTotalCount: number;
    page: number;
    size: number;
}

export type NarrowcastRequestBody = {
    messages: Line.Message | Line.Message[];
    recipient?: ReceieptObject;
    filter?: { demographic: DemographicFilterObject };
    limit?: { max: number };
    notificationDisabled?: boolean;
}

export type CreateUploadAudienceGroupRequestBody = {
    description: string;
    isIfaAudience: boolean;
    audiences: { id: string }[];
    uploadDescription?: string;
}

export type updateUploadAudienceGroupRequestBody = {
    audienceGroupId: number;
    uploadDescription?: string;
    audiences: { id: string }[];
}