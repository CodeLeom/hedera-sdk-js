import TopicId from "./TopicId";
import AccountId from "../account/AccountId";
import Timestamp from "../Timestamp";
import proto from "@hashgraph/proto";
import { _fromProtoKey, _toProtoKey } from "../util";
import { Key } from "@hashgraph/cryptography";
import Long from "long";

/**
 * Current state of a topic.
 */
export default class TopicInfo {
    /**
     * @private
     * @param {object} props
     * @param {TopicId} props.topicId
     * @param {string} props.topicMemo
     * @param {Uint8Array} props.runningHash
     * @param {Long} props.sequenceNumber
     * @param {Timestamp} props.expirationTime
     * @param {?Key} props.adminKey
     * @param {?Key} props.submitKey
     * @param {number} props.autoRenewPeriod
     * @param {?AccountId} props.autoRenewAccountId
     */
    constructor(props) {
        /**
         * The ID of the topic for which information is requested.
         *
         * @readonly
         */
        this.topicId = props.topicId;

        /**
         * Short publicly visible memo about the topic. No guarantee of uniqueness.
         *
         * @readonly
         */
        this.topicMemo = props.topicMemo;

        /**
         * SHA-384 running hash of (previousRunningHash, topicId, consensusTimestamp, sequenceNumber, message).
         *
         * @readonly
         */
        this.runningHash = props.runningHash;

        /**
         * Sequence number (starting at 1 for the first submitMessage) of messages on the topic.
         *
         * @readonly
         */
        this.sequenceNumber = props.sequenceNumber;

        /**
         * Effective consensus timestamp at (and after) which submitMessage calls will no longer succeed on the topic.
         *
         * @readonly
         */
        this.expirationTime = props.expirationTime;

        /**
         * Access control for update/delete of the topic. Null if there is no key.
         *
         * @readonly
         */
        this.adminKey = props.adminKey;

        /**
         * Access control for ConsensusService.submitMessage. Null if there is no key.
         *
         * @readonly
         */
        this.submitKey = props.submitKey;

        /**
         * @readonly
         */
        this.autoRenewPeriod = props.autoRenewPeriod;

        /**
         * @readonly
         */
        this.autoRenewAccountId = props.autoRenewAccountId;

        Object.freeze(this);
    }

    /**
     * @internal
     * @param {proto.IConsensusGetTopicInfoResponse} infoResponse
     * @returns {TopicInfo}
     */
    static _fromProtobuf(infoResponse) {
        const info = /** @type {proto.IConsensusTopicInfo} */ (infoResponse.topicInfo);

        return new TopicInfo({
            topicId: TopicId._fromProtobuf(
                /** @type {proto.ITopicID} */ (infoResponse.topicID)
            ),
            topicMemo: info.memo ?? "",
            runningHash: info.runningHash ?? new Uint8Array(),
            sequenceNumber:
                info.sequenceNumber != null
                    ? info.sequenceNumber instanceof Long
                        ? info.sequenceNumber
                        : Long.fromValue(info.sequenceNumber)
                    : Long.ZERO,
            expirationTime:
                info.expirationTime != null
                    ? Timestamp._fromProtobuf(info.expirationTime)
                    : new Timestamp(0, 0),
            adminKey:
                info.adminKey != null ? _fromProtoKey(info.adminKey) : null,
            submitKey:
                info.submitKey != null ? _fromProtoKey(info.submitKey) : null,
            autoRenewPeriod:
                info.autoRenewPeriod?.seconds instanceof Long
                    ? info.autoRenewPeriod.seconds.toNumber()
                    : info.autoRenewPeriod?.seconds ?? 0,
            autoRenewAccountId:
                info.autoRenewAccount != null
                    ? AccountId._fromProtobuf(info.autoRenewAccount)
                    : null,
        });
    }

    /**
     * @internal
     * @returns {proto.IConsensusGetTopicInfoResponse}
     */
    _toProtobuf() {
        return {
            topicID: this.topicId._toProtobuf(),
            topicInfo: {
                memo: this.topicMemo,
                runningHash: this.runningHash,
                sequenceNumber: this.sequenceNumber,
                expirationTime: this.expirationTime._toProtobuf(),
                adminKey:
                    this.adminKey != null ? _toProtoKey(this.adminKey) : null,
                submitKey:
                    this.submitKey != null ? _toProtoKey(this.submitKey) : null,
                autoRenewPeriod: {
                    seconds: this.autoRenewPeriod,
                },
                autoRenewAccount: this.autoRenewAccountId?._toProtobuf(),
            },
        };
    }
}