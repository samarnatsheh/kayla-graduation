import { invitationContent } from '@/lib/invitationContent';
import s from './invitation.module.css';

export default function GraduateName() {
  return (
    <h1 className={`${s.block} ${s.name}`}>
      <span className={s.nameClip} data-anim="name-clip">
        <span className={s.nameText} data-anim="name-text">
          {invitationContent.graduateName}
        </span>
      </span>
    </h1>
  );
}
