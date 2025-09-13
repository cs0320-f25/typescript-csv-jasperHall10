# Sprint 1: TypeScript CSV

### Task B: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
- Should include a way to include commas in an entry
- Should include a way for the caller to choose how the data is parsed
- Should allow for multiple ways in which the data can be returned
- Should have an option allowing for the caller to specify a column that they specifically want returned

- #### Step 2: Use an LLM to help expand your perspective.
- The first LLM prompt suggested that the parser test include delimiter flexibility, quoted fields(which I mentioned),
Newlines inside of fields, line by line parsing of large csv files, and header row options(similar to the caller
choosing how the data is returned/stored). Most of the stuff that I missed had to do with concepts I did not know (i.e. delimiter flexibility). I think it did miss some options for the caller to have more control over the results.
- For the second LLM prompt I chose to provide the LLM with a more grassroots prompt, just asking it for common features of a CSV Parser. From this I got a lot of the same results as the first prompt, as well as some more basic ones (highlighting that the default delimiter in a csv is a comma). This prompt got into much deeper depth though, seperating responses into Core features, data handling features, advanced features, and extra utilities. It was in the extra utilities where it mentioned using schema support, and flexible outputs(different objects/arrays being returned). 
- For the final LLM post I asked the LLM to specifically focus on features that would be loved by the callers. Once again I found a lot of overlap between this and the previous two posts, however, unlike the second prompt, there was a significantly smaller focus on technical additions. Instead, there was a section about QoL features, such as auto-detecting a delimiter, date/number coercion, and progress reporting for larger files. All of these much more centered on improving the experience of the caller.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 
    1. Allow for quotations to act as a way to include a delimiter in an entry (FUNCTIONALITY)
        - I came up with this and the LLM prompts backed it up
        - User Story: As a user I can access data that includes commas, or other delimiters, so I can ensure that the parsed data is accurate to its original meaning.
            - Acceptance Criteria
                - Quotations will be viewed as delimiters which overwrite the standard delimiter
                - Commas can be included in elements
    2. Allow the caller to choose how the data is outputes (what form it takes after parsed) (EXTENSIBILITY)
        - I came up with this and the LLM prompts backed it up
        - User Story: As a user I can choose which way the CSV is parsed, so I can utilize the parsed data however I deem fit.
            - Acceptance Criteria
                - User can tell parser which data type the array holds
                - User will be informed if the CSV cannot be parsed in that manner
                - Parser will follow users instructions
    3. Large CSV files get pushed out bit by bit (FUNCTIONALITY)
        - LLM idea
        - User Story: As a user I can access large CSV files without my time or memory being hindered.
            - Acceptance Criteria
                - Large CSVs will take same time to initially load as small CSV files
                - Large CSVs will be broken up into 'pages'
    4. Parser informs users of how much of CSV has been parsed/ how much they currently have access to (EXTENSIBILITY)
        - LLM idea
        - User Story: As a user I can know how long it will take until my CSV is fully parsed, and how much of it has been parsed, so I can determine if I need the rest of the CSV to be parsed as well.
            - Acceptance Criteria
                - User can select the amount of CSV shown at once
                - User is informed about how much and what portion of CSV is currently being displayed
                - User can manually make parser load more or less of CSV

    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

    My initial ideas had to do a lot with the definition of a CSV Parser in the appendix of the assignment (e.g. differeing return types, quotations to include commas). The LLM prompts did include a lot of the same information that this appendix, and my ideas did, however, they also included much more. Depending on how it was prompted, the LLM could include information regarding more developer sided features, or more caller sided features. All of the outputed features also tended to come organizes based on which side they were on (developer/caller) and how advanced they were.

### Design Choices
When implementing Zod schema into the parseCSV method of basic-parser.ts I made a phew design desisions. Firstly, with regard to parameters and return types I allowed the method to additionally take in a schema of type ZodSchema<T> the <T> representing the unknown possible types which the schema could be. I also allowed for the schema to be of type undefined in case the caller does not define a schema. With regard to return types I allowed it to return types of string[][] in case the schema was undefined, T[] in case the schema was defined, and ZodError<T> in the case which a schema was defined and the CSV did not adhere to it. The only main design choice I made on this methods body was by creating two for loops, one in which the schema is undefined, which would result in the original parseCSV code, and one in which it is defined. The latter would either add the object after the array is parsed to the result array, or, if the parsing goes arry, return a ZodError.
### 1340 Supplement
n/a
- #### 1. Correctness
I would define a CSVParsers correctness based mostly on its ability to correctly categorize the data it recieves. In our sense it would be heavily reliant on how much the schema works to classify/categorize the data into the different attributes of the given type. That is at least how our parser works right now. Overall parsers correctness would also be impacted by other things, the one mainly popping up to me now is if the parser correctly partitions (this is basically the comma problem). I think the tests should ensure that type errors are only thrown if the CSV is incorrect, that the right number of rows are included, that each row contains the correct object/type, that each instance of a type contains the correct data in the correct place, etc.
- #### 2. Random, On-Demand Generation
If we were provided with this class than our testing would expand drastically. These randomly generated CSVs could come up with a plethora of different kinds of forms of CSVs with different delimiters and different column/row lengths. All of these things would test our parser in different ways. As the class always generates CSVs there is a chance that, in use, the parser could be asked to parse any of them, and as such it is good practice to test as many, and as different, forms of possible CSVs that could be thought of. A good parser is a flexible one, and this would test our parsers ability to be just that.
- #### 3. Overall experience, Bugs encountered and resolved
This sprint was different from other programming assignments in that it was mostly just writing and thinking. The coding portion was only one function, and honestly it was only editing one function. There was the ability to use LLMs which is also new, but outside of Step 2 I chose not to use it, as I do not know the best way to use it yet. Nothing really surprised me except learning how Zod works, but that was less surprising and more educational so to speak. I did encounter bugs, mostly to do with testing, and type checking. The main one was learning how to deal with the error that should be thrown when the parsing does not work out correctly. Honestly, this had me entirely confused until I found an Ed post which told me to use instanceof. Coming from taking CS15, instanceof is very tabboo in my head so I did not think of using it. This opening of my mind ostensibly fixed all of my bugs as I had a new tool to use which could fix all of them.
#### Errors/Bugs: 
Not all tests pass(intentional so not really a bug, but is the only current error that might qualify)
#### Tests: 
- Checks to see if parseCSV returns an array, and that each element of that array includes what it should (used for the undefined schema case)
- Checks to see if parseCSV returns an array of only arrays (used for the undefined schema case)
- Checks to see if parseCSV views quotations as a way to contain an entire element, even if includes delimiters (used for the undefined schema case)
- Checks to see if parseCSV views blank space as elements (used for the undefined schema case)
- Checks to see if parseCSV can turn "thirty" into 30 when using zod (used for the defined schema case)
- Checks to see if parseCSV can create an array without throwing errors if CSV should obviously fit the schema (used for the undefined schema case)
- Checks to see if parseCSV views quotations as a way to contain an entire element, even if includes delimiters (used for the undefined schema case)
#### How To… 
Call `npm test` to run all of the tests
#### Team members and contributions (include cs logins):
n/a
#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
ChatGPT for Step 2 brainstorming
#### Total estimated time it took to complete project: 
6
#### Link to GitHub Repo:  
https://github.com/cs0320-f25/typescript-csv-jasperHall10