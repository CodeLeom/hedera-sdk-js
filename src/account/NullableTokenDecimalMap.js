import TokenId from "../token/TokenId.js";
import ObjectMap from "../ObjectMap.js";

/**
 * @namespace proto
 * @typedef {import("@hashgraph/proto").proto.ITokenBalance} HashgraphProto.proto.ITokenBalance
 * @typedef {import("@hashgraph/proto").proto.ITokenID} HashgraphProto.proto.ITokenID
 */

/**
 * @augments {ObjectMap<TokenId, number | null>}
 */
export default class NullableTokenDecimalMap extends ObjectMap {
    constructor() {
        super((s) => TokenId.fromString(s));
    }
}