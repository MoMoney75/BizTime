\c biztime_db

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS industries_companies CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;

CREATE TABLE industries (
id serial PRIMARY KEY NOT NULL UNIQUE,
industry_name text NOT NULL UNIQUE
);



CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE industries_companies (
industry_id integer REFERENCES industries(id) ON DELETE CASCADE,
company_code text REFERENCES companies(code) ON DELETE CASCADE

);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies(code) ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);



INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('PAG', 'PORSCHE', 'Automotive'),
         ('PBX', 'PUBLIX', 'Groceries'),
         ('SNAP', 'SNAP-ON', 'Tool Manufacturer')
         ;

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null),
         ('PAG', 100000, false,null),
         ('PBX', 250, false, null),
         ('SNAP', 900, false,null)
         ;


INSERT INTO industries (industry_name)
VALUES ('Technology'),
        ('Software'),
        ('Automotive'),
        ('Gaming'),
        ('Tools'),
        ('Groceries');

INSERT INTO industries_companies(industry_id, company_code)
VALUES(1,'apple'),
      (1, 'ibm'),
      (3,'PAG'),
      (6, 'PBX'),
      (5, 'SNAP')
      ;

