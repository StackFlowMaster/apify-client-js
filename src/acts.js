import _ from 'underscore';
import { checkParamOrThrow, pluckData, catchNotFoundOrThrow, encodeBody } from './utils';

/**
 * Acts
 * @module apifier-client
 * @memberOf ApifyClient
 * @namespace acts
 */

export const BASE_PATH = '/v2/acts';
export const WAIT_FOR_FINISH_SECS = 120;

export default {
    /**
     * List of Acts
     *
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<TResult>|*}
     */
    listActs: (requestPromise, options) => {
        const { baseUrl, token, offset, limit } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(token, 'token', 'String');
        checkParamOrThrow(limit, 'limit', 'Maybe Number');
        checkParamOrThrow(offset, 'offset', 'Maybe Number');

        const query = { token };

        if (limit) query.limit = limit;
        if (offset) query.offset = offset;

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}`,
            json: true,
            method: 'GET',
            qs: query,
        })
        .then(pluckData);
    },

    /**
     * @memberof acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<TResult>|*}
     */
    createAct: (requestPromise, options) => {
        const { baseUrl, token, act } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(token, 'token', 'String');
        checkParamOrThrow(act, 'act', 'Object');

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}`,
            json: true,
            method: 'POST',
            qs: { token },
            body: act,
        })
        .then(pluckData);
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<TResult>|*}
     */
    updateAct: (requestPromise, options) => {
        const { baseUrl, token, actId, act } = options;
        const safeActId = !actId && act.id ? act.id : actId;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(token, 'token', 'String');
        checkParamOrThrow(safeActId, 'actId', 'String');
        checkParamOrThrow(act, 'act', 'Object');

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${safeActId}`,
            json: true,
            method: 'PUT',
            qs: { token },
            body: _.omit(act, 'id'),
        })
        .then(pluckData);
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {*}
     */
    deleteAct: (requestPromise, options) => {
        const { baseUrl, token, actId } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(actId, 'actId', 'String');

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${actId}`,
            json: true,
            method: 'DELETE',
            qs: { token },
        });
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<T>}
     */
    getAct: (requestPromise, options) => {
        const { baseUrl, token, actId } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(actId, 'actId', 'String');

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${actId}`,
            json: true,
            method: 'GET',
            qs: { token },
        })
        .then(pluckData)
        .catch(catchNotFoundOrThrow);
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<TResult>|*}
     */
    listRuns: (requestPromise, options) => {
        const { baseUrl, token, actId, offset, limit } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(actId, 'actId', 'String');
        checkParamOrThrow(token, 'token', 'String');
        checkParamOrThrow(limit, 'limit', 'Maybe Number');
        checkParamOrThrow(offset, 'offset', 'Maybe Number');

        const query = { token };

        if (limit) query.limit = limit;
        if (offset) query.offset = offset;

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${actId}/runs`,
            json: true,
            method: 'GET',
            qs: query,
        })
        .then(pluckData);
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<TResult>|*}
     */
    // TODO: Ensure that body is null or string or buffer
    runAct: (requestPromise, options) => {
        const { baseUrl, token, actId, contentType, body, useRawBody, waitForFinish } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(token, 'token', 'String');
        checkParamOrThrow(actId, 'actId', 'String');
        checkParamOrThrow(contentType, 'contentType', 'Maybe String');
        checkParamOrThrow(useRawBody, 'useRawBody', 'Maybe Boolean');
        checkParamOrThrow(waitForFinish, 'waitForFinish', 'Maybe Number');

        const encodedBody = useRawBody ? body : encodeBody(body, contentType);
        const query = { token };

        if (waitForFinish) query.waitForFinish = waitForFinish;

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${actId}/runs`,
            method: 'POST',
            headers: {
                'Content-Type': contentType,
            },
            body: encodedBody,
            qs: query,
        })
        .then(response => JSON.parse(response))
        .then(pluckData);
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<T>}
     */
    getRun: (requestPromise, options) => {
        const { baseUrl, token, actId, runId, waitForFinish } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(actId, 'actId', 'String');
        checkParamOrThrow(runId, 'runId', 'String');
        checkParamOrThrow(waitForFinish, 'waitForFinish', 'Maybe Number');

        const query = { token };

        if (waitForFinish) query.waitForFinish = waitForFinish;

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${actId}/runs/${runId}`,
            json: true,
            method: 'GET',
            qs: query,
        })
        .then(pluckData)
        .catch(catchNotFoundOrThrow);
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<TResult>|*}
     */
    listBuilds: (requestPromise, options) => {
        const { baseUrl, token, actId, offset, limit } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(actId, 'actId', 'String');
        checkParamOrThrow(token, 'token', 'String');
        checkParamOrThrow(limit, 'limit', 'Maybe Number');
        checkParamOrThrow(offset, 'offset', 'Maybe Number');

        const query = { token };

        if (limit) query.limit = limit;
        if (offset) query.offset = offset;

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${actId}/builds`,
            json: true,
            method: 'GET',
            qs: query,
        })
        .then(pluckData);
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<TResult>|*}
     */
    buildAct: (requestPromise, options) => {
        const { baseUrl, token, actId, waitForFinish } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(token, 'token', 'String');
        checkParamOrThrow(actId, 'actId', 'String');
        checkParamOrThrow(waitForFinish, 'waitForFinish', 'Maybe Number');

        const query = { token };

        if (waitForFinish) query.waitForFinish = waitForFinish;

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${actId}/builds`,
            json: true,
            method: 'POST',
            qs: query,
        })
        .then(pluckData);
    },

    /**
     * @memberof ApifyClient.acts
     * @param requestPromise
     * @param options
     * @returns {Promise.<T>}
     */
    getBuild: (requestPromise, options) => {
        const { baseUrl, token, actId, buildId, waitForFinish } = options;

        checkParamOrThrow(baseUrl, 'baseUrl', 'String');
        checkParamOrThrow(actId, 'actId', 'String');
        checkParamOrThrow(buildId, 'buildId', 'String');
        checkParamOrThrow(waitForFinish, 'waitForFinish', 'Maybe Number');

        const query = { token };

        if (waitForFinish) query.waitForFinish = waitForFinish;

        return requestPromise({
            url: `${baseUrl}${BASE_PATH}/${actId}/builds/${buildId}`,
            json: true,
            method: 'GET',
            qs: query,
        })
        .then(pluckData)
        .catch(catchNotFoundOrThrow);
    },

};
