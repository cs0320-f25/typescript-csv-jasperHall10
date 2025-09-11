import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const ROMAN_CSV_PATH = path.join(__dirname, "../data/roman.csv");

test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH);

  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

test("parseCSV commas in quotations retained", async () => {
  const results = await parseCSV(ROMAN_CSV_PATH);

  expect(results).toHaveLength(2);
  expect(results[0]).toEqual(['Caesar']);
  expect(results[1]).toEqual(['Julius','veni, vidi, vici']);
});