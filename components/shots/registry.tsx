import { AcademyBuilder, AcademyLive, AcademyPlayer } from "./academy";
import { AssessBuilder, AssessReview } from "./assess";
import { AiStudent, AiTeacher } from "./ai";
import { HomeApp, PlatformRecord, SecurityAdmin } from "./platform";
import { AcademyStorefront } from "./storefront";
import { PhoneCandidateCheck, PhoneCoursePurchase, PhoneLiveClass, PhoneParentHome, PhoneStudentDoubt, PhoneStudentLesson, PhoneStudentResults } from "./phones";

import { shotMeta, type ShotId } from "./meta";

/** Screen component for each shot id; sizes and alt text live in ./meta. */
export const screens: Record<ShotId, () => React.ReactNode> = {
  "home-app": HomeApp,
  "platform-record": PlatformRecord,
  "security-admin": SecurityAdmin,
  "academy-storefront": AcademyStorefront,
  "academy-builder": AcademyBuilder,
  "academy-player": AcademyPlayer,
  "academy-live": AcademyLive,
  "assess-review": AssessReview,
  "assess-builder": AssessBuilder,
  "ai-student": AiStudent,
  "ai-teacher": AiTeacher,
  "phone-parent-home": PhoneParentHome,
  "phone-student-results": PhoneStudentResults,
  "phone-live-class": PhoneLiveClass,
  "phone-course-purchase": PhoneCoursePurchase,
  "phone-student-lesson": PhoneStudentLesson,
  "phone-candidate-check": PhoneCandidateCheck,
  "phone-student-doubt": PhoneStudentDoubt,
};

export { shotMeta, type ShotId };
