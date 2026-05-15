const fs = require('fs');

/**
 * Lit la base de données de manière asynchrone et compte les étudiants.
 * @param {string} path Le chemin vers le fichier CSV.
 * @returns {Promise}
 */
function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      // Nettoyage des lignes (on retire les lignes vides)
      const lines = data.split('\n').filter((line) => line.trim() !== '');
      const studentsLines = lines.slice(1);

      console.log(`Number of students: ${studentsLines.length}`);

      const fields = {};
      studentsLines.forEach((line) => {
        const student = line.split(',');
        // On récupère le prénom et le domaine (field)
        const firstname = student[0];
        const field = student[3];

        if (!fields[field]) {
          fields[field] = [];
        }
        fields[field].push(firstname);
      });

      // On utilise Object.keys pour être compatible avec les règles ESLint strictes
      Object.keys(fields).forEach((field) => {
        const list = fields[field].join(', ');
        console.log(`Number of students in ${field}: ${fields[field].length}. List: ${list}`);
      });

      resolve();
    });
  });
}

module.exports = countStudents;
