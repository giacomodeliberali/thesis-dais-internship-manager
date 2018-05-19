import * as StateMachine from 'javascript-state-machine';
import { InternshipProposalStatusType, RoleType } from 'gdl-thesis-core/dist';
import { canExec } from '../auth/can-exec.helper';

/**
 * The state machine helper for the [[InternshipProposalStatusType]]
 */
export class InternshipProposalStatusTypeMachine {

    /** The state machine */
    private stateMachine: StateMachine;

    /** The allowed transitions */
    private transitions = [

        // Accepting flaw
        { name: 'approvedByProfessor', from: InternshipProposalStatusType.Started.toString(), to: InternshipProposalStatusType.WaitingForProfessor.toString(), requiredRoles: [RoleType.Professor] },
        { name: 'approvedByCompany', from: InternshipProposalStatusType.WaitingForProfessor.toString(), to: InternshipProposalStatusType.WaitingForCompany.toString(), requiredRoles: [RoleType.Professor] },
        { name: 'confirmed', from: InternshipProposalStatusType.WaitingForCompany.toString(), to: InternshipProposalStatusType.Confirmed.toString(), requiredRoles: [RoleType.Company] },
        { name: 'started', from: InternshipProposalStatusType.Confirmed.toString(), to: InternshipProposalStatusType.Started.toString() },
        { name: 'ended', from: InternshipProposalStatusType.Started.toString(), to: InternshipProposalStatusType.Ended.toString() },

        // Professor reject
        { name: 'rejectedByProfessor', from: InternshipProposalStatusType.WaitingForProfessor.toString(), to: InternshipProposalStatusType.RejectedByProfessor.toString(), requiredRoles: [RoleType.Professor] },

        // Company reject
        { name: 'rejectedByCompany', from: InternshipProposalStatusType.WaitingForCompany.toString(), to: InternshipProposalStatusType.RejectedByCompany.toString(), requiredRoles: [RoleType.Company] },

        // Student cancel
        { name: 'canceled', from: InternshipProposalStatusType.WaitingForProfessor.toString(), to: InternshipProposalStatusType.Canceled.toString(), requiredRoles: [RoleType.Student, RoleType.Professor] },
        { name: 'canceled', from: InternshipProposalStatusType.WaitingForCompany.toString(), to: InternshipProposalStatusType.Canceled.toString(), requiredRoles: [RoleType.Student, RoleType.Professor] },
    ];

    /**
     * Create a new state machine initialized with a state
     * @param initialState The initial state of this machine
     */
    constructor(initialState: InternshipProposalStatusType) {
        this.stateMachine = new StateMachine({
            init: initialState.toString(),
            transitions: this.transitions
        });
    }

    /**
     * Return all the available state from the current one
     */
    getAvailableStates(userRole?: RoleType): Array<{ value: InternshipProposalStatusType, text: string }> {
        const transitions: Array<string> = this.stateMachine.transitions();
        const currentState = Number(this.stateMachine.state);
        const states: Array<any> = [
            {
                value: currentState,
                text: InternshipProposalStatusType[currentState]
            }
        ];
        this.transitions.forEach(t => {
            const transition = userRole ? transitions.find(s => s === t.name && canExec(userRole, t.requiredRoles)) : transitions.find(s => s === t.name);
            if (transition) {
                const v = Number(t.to);
                if (!states.find(s => s.value === v)) {
                    states.push({
                        value: v,
                        text: InternshipProposalStatusType[v]
                    });
                }
            }
        });
        return states;
    }

    /**
     * Return true if exist a transition between the current state and the new state
     * @param newState The new state
     */
    can(newState: InternshipProposalStatusType) {
        if (newState === null || newState === undefined)
            return false;
        const transition = this.transitions.find(t => t.to === newState.toString());
        return this.stateMachine.can(transition.name);
    }
}