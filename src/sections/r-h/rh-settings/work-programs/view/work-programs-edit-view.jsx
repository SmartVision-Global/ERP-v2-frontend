import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WorkProgramsNewEditForm } from '../work-programs-new-edit-form';

// ----------------------------------------------------------------------

export function WorkProgramsEditView({ workPrograms }) {
  let newCurrentProgram = null;
  if (workPrograms) {
    newCurrentProgram = {
      ...workPrograms,
      days: workPrograms?.days?.map((day) =>
        // const [hour, minute, second] = day?.start_time?.split(':');
        ({
          // ...day,
          absence_value: day.absence_value,
          start_time: day.start_time,
          end_time: day.end_time,
          break_start: day.break_start,
          break_end: day.break_end,
          is_work_day: day.is_work_day ? 'true' : 'false',
          pause: day.break_start === null ? 'false' : 'true',
        })
      ),
      rotation_days: workPrograms?.days?.length || 1,
    };
  }
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.workPrograms}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Programmes de travail', href: paths.dashboard.rh.rhSettings.workPrograms },
          { name: workPrograms?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {newCurrentProgram && <WorkProgramsNewEditForm currentProduct={newCurrentProgram} />}
    </DashboardContent>
  );
}
