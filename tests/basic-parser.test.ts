import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z, ZodError } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const ROMAN_CSV_PATH = path.join(__dirname, "../data/roman.csv");
const BLANK_SPACE_PATH = path.join(__dirname, "../data/blankspace.csv");
const SIMPLE_PEOPLE_CSV_PATH = path.join(__dirname, "../data/peoplesimple.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, undefined);
  
  if (!(results instanceof ZodError)) {
    expect(results).toHaveLength(5);
    expect(results[0]).toEqual(["name", "age"]);
    expect(results[1]).toEqual(["Alice", "23"]);
    expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
    expect(results[3]).toEqual(["Charlie", "25"]);
    expect(results[4]).toEqual(["Nim", "22"]);
  }
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, undefined);

  if (!(results instanceof ZodError)) {
    for(const row of results) {
      expect(Array.isArray(row)).toBe(true);
    }
  }
});

test("parseCSV commas in quotations retained", async () => {
  const results = await parseCSV(ROMAN_CSV_PATH, undefined);

  if (!(results instanceof ZodError)) {
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual(['Caesar']);
    expect(results[1]).toEqual(['Julius','veni, vidi, vici']);
  }
});

test("parseCSV blankspace included in entries", async () => {
  const results = await parseCSV(BLANK_SPACE_PATH, undefined);

  if (!(results instanceof ZodError)) {
    expect(results).toHaveLength(3);
    expect(results[0]).toEqual([" "," "]);
    expect(results[1]).toEqual(["  "]);
    expect(results[2]).toEqual(["","",""]);
  }
});

const PersonRowSchema = z.tuple([z.string(), z.string().optional()])
                                .transform( tup => ({name: tup[0], quote: tup[1]}));
test("parseCSV with quote schema", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PersonRowSchema);

  expect(results).toBeInstanceOf(ZodError);
});

test("parseCSV with person schema", async () => {
  const results = await parseCSV(SIMPLE_PEOPLE_CSV_PATH, PersonRowSchema);

  expect(results).toHaveLength(4);
});

const FigureQuoteSchema = z.tuple([z.string(), z.string().optional()])
                                .transform( tup => ({name: tup[0], quote: tup[1]}));
test("parseCSV with quote schema", async () => {
  const results = await parseCSV(ROMAN_CSV_PATH, FigureQuoteSchema);

  expect(results).toBeInstanceOf(ZodError);
});
