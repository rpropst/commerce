import type { NextApiRequest, NextApiResponse } from "next"
import { withSentry } from "@sentry/nextjs";
import * as Sentry from '@sentry/nextjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    throw new Error("API throw error test");
    res.status(200).json({ result: "foobar" });
  }
  catch (ex) {
    console.log('caught exception')
    Sentry.captureException(ex)
    res.json({});
    res.status(500);
    res.end();
  }
};

export default withSentry(handler);