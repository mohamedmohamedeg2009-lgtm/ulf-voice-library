import { z } from "zod";

export const timezoneAwareDateTimeSchema = z.iso.datetime({ offset: true });
