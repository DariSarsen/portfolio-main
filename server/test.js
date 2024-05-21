// test/projectRoutes.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); 
const Project = require('../models/project');
const mongoose = require('mongoose');
const expect = chai.expect;


chai.use(chaiHttp);

describe('Project Routes', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /projects', () => {
    it('should get all projects', (done) => {
      chai.request(app)
        .get('/projects')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /projects/:id', () => {
    it('should get a project by id', (done) => {
      const project = new Project({ title: 'Test Project', subtitle: 'Test Subtitle', description: 'Test Description' });
      project.save((err, project) => {
        chai.request(app)
          .get(`/projects/${project.id}`)
          .set('Authorization', `Bearer validToken`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('title', 'Test Project');
            done();
          });
      });
    });

    it('should return 404 for a non-existing project', (done) => {
      const fakeId = mongoose.Types.ObjectId();
      chai.request(app)
        .get(`/projects/${fakeId}`)
        .set('Authorization', `Bearer validToken`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe('POST /projects', () => {
    it('should create a new project', (done) => {
      const project = { title: 'New Project', subtitle: 'New Subtitle', description: 'New Description' };
      chai.request(app)
        .post('/projects')
        .set('Authorization', `Bearer validToken`)
        .send(project)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('title', 'New Project');
          done();
        });
    });

    it('should return 400 for invalid project data', (done) => {
      const project = { title: '' };
      chai.request(app)
        .post('/projects')
        .set('Authorization', `Bearer validToken`)
        .send(project)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe('PATCH /projects/:id', () => {
    it('should update a project', (done) => {
      const project = new Project({ title: 'Update Project', subtitle: 'Update Subtitle', description: 'Update Description' });
      project.save((err, project) => {
        chai.request(app)
          .patch(`/projects/${project.id}`)
          .set('Authorization', `Bearer validToken`)
          .send({ title: 'Updated Project' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('title', 'Updated Project');
            done();
          });
      });
    });

    it('should return 404 for a non-existing project', (done) => {
      const fakeId = mongoose.Types.ObjectId();
      chai.request(app)
        .patch(`/projects/${fakeId}`)
        .set('Authorization', `Bearer validToken`)
        .send({ title: 'Updated Project' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete a project', (done) => {
      const project = new Project({ title: 'Delete Project', subtitle: 'Delete Subtitle', description: 'Delete Description' });
      project.save((err, project) => {
        chai.request(app)
          .delete(`/projects/${project.id}`)
          .set('Authorization', `Bearer validToken`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Проект удален');
            done();
          });
      });
    });

    it('should return 404 for a non-existing project', (done) => {
      const fakeId = mongoose.Types.ObjectId();
      chai.request(app)
        .delete(`/projects/${fakeId}`)
        .set('Authorization', `Bearer validToken`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
