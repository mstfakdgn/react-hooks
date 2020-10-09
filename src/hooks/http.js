import { useReducer, useCallback } from 'react';

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null, extra:null, identifier:action.identifier };
        case 'RESPONSE':
            return { ...httpState, loading: false, data: action.data, extra:action.extra }
        case 'ERROR':
            return { loading: false, error: action.errorMessage }
        case 'CLEAR':
            return { ...httpState, error: null }
        default:
            throw new Error('Should not get hear')
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {
        loading: false, error: false, data: null, extra:null, identifier:null
    });

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({ type: 'SEND', identifier:reqIdentifier});
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(res => {
            console.log(res);
            dispatchHttp({ type: 'RESPONSE' , data:res, extra: reqExtra});

        }).catch(err => {
            dispatchHttp({ type: 'ERROR', errorMessage: err.message });
        })
    }, [])

    return {
        isLoading:httpState.loading,
        data:httpState.data,
        error:httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        identifier:httpState.identifier
    };
}

export default useHttp;