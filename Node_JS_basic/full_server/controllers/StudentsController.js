import { readDatabase } from '../utils';

export default class StudentsController {
  static getAllStudents(req, res) {
    readDatabase(process.argv[2])
      .then((fields) => {
        const sorted = Object.keys(fields).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        let output = 'This is the list of our students';
        for (const field of sorted) {
          output += `\nNumber of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}`;
        }
        res.status(200).send(output);
      })
      .catch(() => {
        res.status(500).send('Cannot load the database');
      });
  }

  static getAllStudentsByMajor(req, res) {
    const { major } = req.params;
    if (major !== 'CS' && major !== 'SWE') {
      res.status(500).send('Major parameter must be CS or SWE');
      return;
    }
    readDatabase(process.argv[2])
      .then((fields) => {
        res.status(200).send(`List: ${(fields[major] || []).join(', ')}`);
      })
      .catch(() => {
        res.status(500).send('Cannot load the database');
      });
  }
}
