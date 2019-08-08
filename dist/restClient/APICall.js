'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isUrl = require('is-url');

var _isUrl2 = _interopRequireDefault(_isUrl);

var _properUrlJoin = require('proper-url-join');

var _properUrlJoin2 = _interopRequireDefault(_properUrlJoin);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc Represents an API call.
 * @class
 * @abstract
 */
var APICall = function () {

    /**
     * Create a APICall.
     * @constructor
     * @param luminoNodeBaseUrl - A string with the base URL for lumino node.
     * @param debug - Flag to see request and responses detail
     */
    function APICall(luminoNodeBaseUrl, debug) {
        _classCallCheck(this, APICall);

        if (!(0, _isUrl2.default)(luminoNodeBaseUrl)) throw new Error('The base URL provided for lumino node is not valid');

        if (debug) {
            _axios2.default.interceptors.request.use(function (request) {
                console.log('Starting Request');
                console.log('URL:', request.url);
                console.log('METHOD: ', request.method);
                console.log('DATA: ', request.data);
                console.log('HEADERS: ', request.headers);
                return request;
            });

            _axios2.default.interceptors.response.use(function (response) {
                console.log('Response:');
                console.log('STATUS:', response.status);
                console.log('STATUS_TEXT:', response.statusText);
                console.log('DATA:', response.data);
                return response;
            });
        }

        this.luminoNodeBaseUrl = luminoNodeBaseUrl;
    }

    /**
     * Fetch the information from the API. But First get a token if a http method change state.
     * For example if request method is: POST, PUT, PATCH or DELETE, the request headers have a token header
     * @return {Promise} - Returns a Promise that, when fulfilled, will either return an JSON Object with the requested
     * data or an Error with the problem.
     */


    _createClass(APICall, [{
        key: 'send',
        value: function send(method, url) {
            var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            var callURL = (0, _properUrlJoin2.default)(this.luminoNodeBaseUrl, url, {
                trailingSlash: false
            });
            var headers = {};
            var body = '';
            var response = void 0;

            if (method === 'GET') {
                if (Object.keys(params).length && params.constructor === Object) {
                    callURL = (0, _properUrlJoin2.default)(callURL, {
                        trailingSlash: false,
                        query: params
                    });
                }
                response = this.makeRequest(callURL, headers, method, params);
            } else {
                var callTokenURL = (0, _properUrlJoin2.default)(this.luminoNodeBaseUrl, 'tokenAction', {
                    trailingSlash: false
                });
                headers['Content-Type'] = 'application/json';
                body = data;

                response = this.makeRequestWithToken(callURL, callTokenURL, body, headers, method);
            }

            return response;
        }

        /**
         * This method call first to get a unique timestamp token, and then call
         * Api with token obtained before.
         *
         * @param callTokenURL
         * @returns {Promise<AxiosResponse<any> | never>}
         */

    }, {
        key: 'makeRequestWithToken',
        value: function makeRequestWithToken(callURL, callTokenURL, data, headersParam, method) {
            var _this = this;

            return (0, _axios2.default)(callTokenURL, {
                method: 'POST'
            }).then(function (response) {
                console.log("makeRequestWithToken" + JSON.stringify(response.data));
                var headers = headersParam;
                headers.token = response.data.token;
                return _this.makeRequest(callURL, headers, method, data);
            }).catch(function (error) {
                console.log("makeRequestWithToken" + JSON.stringify(error.response.data));
                Promise.reject({
                    message: error.message,
                    errors: JSON.stringify(error.response.data)
                });
            });
        }

        /**
         * This method make a sync request to fetch data from API
         *
         * @param callURL
         * @param headers
         * @param method
         * @param data
         * @returns {Promise<AxiosResponse<any>>} Returns a Promise that, when fulfilled, will either return an JSON Object with the requested
         * data or an Error with the problem
         */

    }, {
        key: 'makeRequest',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(callURL, headers, method, data) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _axios2.default)(callURL, {
                                    method: method,
                                    data: data,
                                    headers: headers
                                }).then(function (response) {
                                    console.log("makeRequest" + JSON.stringify(response.data));
                                    return response.data;
                                }).catch(function (error) {
                                    console.log("makeRequest" + JSON.stringify(error.response.data));
                                    Promise.reject({
                                        message: error.message,
                                        errors: JSON.stringify(error.response.data)
                                    });
                                });

                            case 2:
                                return _context.abrupt('return', _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function makeRequest(_x3, _x4, _x5, _x6) {
                return _ref.apply(this, arguments);
            }

            return makeRequest;
        }()
    }]);

    return APICall;
}();

exports.default = APICall;