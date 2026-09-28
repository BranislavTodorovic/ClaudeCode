'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const home = require('../home/home-redesign.js');

test('Home derives Today and Next from canonical local records at a date boundary', () => {
  const model = home.buildModel({
    tasks: [
      { id: 'overdue', text: 'Finish report', due: '2026-09-27', priority: 'high', done: false },
      { id: 'tomorrow', text: 'Send draft', due: '2026-09-29', done: false },
      { id: 'complete', text: 'Already done', due: '2026-09-28', done: true }
    ],
    countdowns: [{ id: 'trip', name: 'Trip', date: '2026-10-01' }],
    projects: [{ id: 'a', status: 'active' }, { id: 'b', status: 'done' }],
    notes: [{ id: 'n' }]
  }, new Date(2026, 8, 28, 23, 59));
  assert.equal(model.today, '2026-09-28');
  assert.equal(model.todayCount, 1);
  assert.deepEqual(model.todayTasks.map(task => task.text), ['Finish report']);
  assert.deepEqual(model.upcoming.map(item => item.title), ['Send draft', 'Trip']);
  assert.equal(model.projects.length, 1);
  assert.equal(model.notes.length, 1);
  assert.equal(model.completedTasks, 1);
  assert.equal(home.dayKey(new Date(2026, 8, 29, 0, 1)), '2026-09-29');
});
