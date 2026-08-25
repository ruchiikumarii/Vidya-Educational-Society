import { useState } from 'react';
import { ChangePassword } from './ChangePassword';
import { PortalTabs } from './features/PortalTabs';
import { NotesManager } from './features/NotesManager';
import { Assignments } from './features/Assignments';
import { Announcements } from './features/Announcements';
import { Timetable } from './features/Timetable';

export function TeacherDashboard() {
  const [tab, setTab] = useState('Notes');

  return (
    <div>
      <PortalTabs tabs={['Notes', 'Assignments', 'Announcements', 'Timetable']} active={tab} onChange={setTab} />

      {tab === 'Notes' && <NotesManager />}
      {tab === 'Assignments' && <Assignments role="teacher" />}
      {tab === 'Announcements' && <Announcements role="teacher" />}
      {tab === 'Timetable' && <Timetable role="teacher" />}

      <div className="mt-10 max-w-2xl">
        <ChangePassword />
      </div>
    </div>
  );
}
