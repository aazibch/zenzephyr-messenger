type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface HttpConfigArguments {
  url: string;
  method: HttpMethods;
  allowCredentials: boolean;
  body?: Record<string, FormDataEntryValue>;
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
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  };
};

export const convertFormDataToObject = (data: FormData) => {
  const dataObj: Record<string, FormDataEntryValue> = {};

  data.forEach((value, key) => (dataObj[key] = value));

  return dataObj;
};

type RequestConfig = {
  url: string;
  method: HttpMethods;
  withCredentials?: boolean;
  headers?: Record<string, string>;
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

  const prettierResponse = {
    httpStatus: response.status,
    status: parsedResponse.status,
    message: parsedResponse.message
  };

  return prettierResponse;
};
