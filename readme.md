# Thesis
Author: *Giacomo De Liberali, 857174@stud.unive.it*

## Project

Create an application to manage university student internships.

### Description

**Actors**

- Student
- Company
- Professor
- Admin

**Main process**

A *company* insert a internship into the platform, which must be approved by an *admin*. Once approved the internship will be published and visible by *students*.

A *student* navigates and select a published internship. Once selected, the *student* will start a request for a internship proposal.

Each internship proposal must have the approval of a *professor* and at last the *company* confirmation.

For every internship published by companies there will be many internship proposal, and the company should select the couple *student/professor* that prefers.

Once the number of confirmed internship proposal equals the internship max students number, the internship will be marked as closed and will no more be visible by other students.

During the internship the company or the student can complete the attendance sheet to monitor the completed hours of the student.

At the end of the internship each student, company or professor can print the pre compiled forms (as well as the attendance sheet) that must be signed.

Furthermore, each subject can evaluate others to create an anonymous ranking mechanism.

## Client
This is the client side section of the application

### Development
To properly generate *typedoc* reference APIs ensure 'node_modules/@types/node/index.ts' ha the following modifications:
```typescript
...

// Comment this declaration
/* interface NodeModule {
    exports: any;
    require: NodeRequireFunction;
    id: string;
    filename: string;
    loaded: boolean;
    parent: NodeModule | null;
    children: NodeModule[];
    paths: string[];
} */

// And replace with this
interface NodeModule {
    id: string;
}

// Otherwise the following line will throw a transpile error
declare var module: NodeModule;

...
```