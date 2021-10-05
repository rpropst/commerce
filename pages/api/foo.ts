import type { NextApiRequest, NextApiResponse } from "next"
import { withSentry } from "@sentry/nextjs";
// import * as Sentry from '@sentry/nextjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let fooStuff = [{func: function () {} }]
    fooStuff[1].func();
    res.status(200).json({ result: "foobar" });
  }
  catch (ex) {
    console.log('caught exception')
    // Sentry.captureException(ex)
    res.json({});
    res.status(500);
    res.end();
  }
};

export default withSentry(handler);