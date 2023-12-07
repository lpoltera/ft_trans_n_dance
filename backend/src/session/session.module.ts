// import { Module } from '@nestjs/common';
// import * as session from 'express-session';
// import * as connectPgSimple from 'connect-pg-simple';
// import Pool = require('pg-pool');

// const PgSession = connectPgSimple(session);

// @Module({
//   providers: [
//     {
//       provide: 'SESSION',
//       useFactory: () =>
//         session({
//           store: new PgSession({
//             createTableIfMissing: true,
//             pool: new Pool({
//               /* Configuration de la pool PostgreSQL */
//               user: 'myappuser',
//               password: 'myapppassword',
//               host: 'postgres',
//               database: 'myappdb',
//               port: 5432,
//             }),
//             tableName: 'sessions', // Nom de la table pour stocker les session
//           }),
//           secret: 'votre_secret_key', // TODO Changez ceci par une clé de session sécurisée
//           resave: false,
//           saveUninitialized: false,
//           cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 jours
//         }),
//     },
//   ],
//   exports: ['SESSION'],
// })
// export class SessionModule {}

// import { Module } from '@nestjs/common';
// import { SessionGuard } from './session.guard';

// @Module({
//   providers: [SessionGuard],
//   exports: [SessionGuard], // Exportez le garde pour qu'il soit disponible pour d'autres modules
// })
// export class SessionModule {}
