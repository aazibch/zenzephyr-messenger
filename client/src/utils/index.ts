import { HttpMethods, FormDataObj, HttpResponseDataObj } from '../types';

interface HttpConfigArguments {
  url: string;
  method: HttpMethods;
  allowCredentials: boolean;
  body?: FormDataObj;
}

export const generateHttpConfig = ({
  url,
  method,
  allowCredentials,
  body
}: HttpConfigArguments) => {
  return {
    url,
    method,
    credentials: allowCredentials ? 'include' : undefined,
    withCredentials: allowCredentials,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  };
};

export const convertFormDataToObject = (data: FormData) => {
  const dataObj: FormDataObj = {};

  data.forEach((value, key) => (dataObj[key] = value));

  return dataObj;
};

type RequestConfig = {
  url: string;
  method: HttpMethods;
  withCredentials?: boolean;
  headers?: {
    [key: string]: string;
  };
  body?: BodyInit;
};

export const sendHttpRequest = async (requestConfig: RequestConfig) => {
  let response = await fetch(requestConfig.url, {
    method: requestConfig.method,
    credentials: requestConfig.withCredentials ? 'include' : undefined,
    headers: requestConfig.headers ? requestConfig.headers : {},
    body: requestConfig.body ? requestConfig.body : null
  });

  const parsedResponse = await response.json();

  const prettierResponse: HttpResponseDataObj = {
    status: response.status,
    statusText: parsedResponse.status
  };

  if (parsedResponse.message) {
    prettierResponse.message = parsedResponse.message;
  }

  if (parsedResponse.data) {
    prettierResponse.data = parsedResponse.data;
  }

  return prettierResponse;
};
