import { NextFunctionProps, RequestProps, ResponseProps } from '@/config';

interface ParsedRequestBody {
  openingHours?: unknown;
  address?: unknown;
  [key: string]: unknown;
}

const isValidJson = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const parseJsonFields = (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
  const fieldsToParse: Array<keyof ParsedRequestBody> = ['openingHours', 'address'];

  fieldsToParse.forEach((field) => {
    const value = (req.body as ParsedRequestBody)[field];
    if (value !== undefined) {
      if (isValidJson(value)) {
        (req.body as ParsedRequestBody)[field] = JSON.parse(value);
      } else {
        return res.status(400).json({
          message: `Invalid JSON format in ${field} field.`
        });
      }
    }

    return undefined;
  });

  next();
};

export default parseJsonFields;
