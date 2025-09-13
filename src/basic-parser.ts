import * as fs from "fs";
import * as readline from "readline";
import { z, ZodType, ZodError } from "zod";

/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when 
 * mousing over this function name. Try it in run-parser.ts!
 * 
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this 
 * in class. For now, just leave the "async" and "await" where they are. 
 * You shouldn't need to alter them.
 * 
 * @param path The path to the file being loaded.
 * @param schema The type that the caller wishes the CSV to be organized by. 
 * Defaults to a string[][] if undefined.
 * @returns a "promise" to produce an array of objects defined by the provided 
 * schema.
 */
export async function parseCSV<T>(path: string, schema: ZodType<T> | undefined): Promise<T[] | string[][] | ZodError<T>> {
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });
  
  // Create an empty array to hold the results
  let result = []
  
  //Determines if schema is not provided and defaults to string[][]
  if (schema == undefined) {
    for await (const line of rl) {
      const values = line.split(",").map((v) => v.trim());
      result.push(values)
    }
    return result
  }

  // We add the "await" here because file I/O is asynchronous. 
  // We need to force TypeScript to _wait_ for a row before moving on. 
  // More on this in class soon!
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());
    const valid = schema.safeParse(values);
    if (valid.success) {
      result.push(valid.data);
    } else {
      return valid.error;
    }
  }
  return result;
}
