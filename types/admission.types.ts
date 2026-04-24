export interface Program {
  program_id: string;
  code: string;
  name: string;
}

export interface Batch {
  batch_id: string;
  label: string;
  start_date: string;
  end_date: string;
}

export interface EnrollmentStatus {
  code: string;
  label: string;
}

export interface CourseValidity {
  value: number;
  unit: string;
  expiry_date: string;
}

export interface Admission {
  admission_id: string;
  program: Program;
  batch?: Batch[];
  enrollment_type: string;
  admission_date: string;
  enrollment_status: EnrollmentStatus;
  course_validity: CourseValidity;
  is_primary: boolean;
}

export interface AdmissionDetailsData {
  admissions: Admission[];
}

export interface AdmissionDetailsResponse {
  status: string;
  data: AdmissionDetailsData;
}
