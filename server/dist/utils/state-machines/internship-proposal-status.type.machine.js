"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine = require("javascript-state-machine");
const thesis_dais_internship_manager_core_1 = require("thesis-dais-internship-manager-core");
const can_exec_helper_1 = require("../auth/can-exec.helper");
/**
 * The state machine helper for the [[InternshipProposalStatusType]]
 */
class InternshipProposalStatusTypeMachine {
    /**
     * Create a new state machine initialized with a state
     * @param initialState The initial state of this machine
     */
    constructor(initialState) {
        /** The allowed transitions */
        this.transitions = [
            // Accepting flaw
            { name: 'approvedByProfessor', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.Started.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.WaitingForProfessor.toString(), requiredRoles: [thesis_dais_internship_manager_core_1.RoleType.Professor] },
            { name: 'approvedByCompany', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.WaitingForProfessor.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.WaitingForCompany.toString(), requiredRoles: [thesis_dais_internship_manager_core_1.RoleType.Professor] },
            { name: 'confirmed', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.WaitingForCompany.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.Confirmed.toString(), requiredRoles: [thesis_dais_internship_manager_core_1.RoleType.Company] },
            { name: 'started', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.Confirmed.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.Started.toString() },
            { name: 'ended', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.Started.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.Ended.toString() },
            // Professor reject
            { name: 'rejectedByProfessor', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.WaitingForProfessor.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.RejectedByProfessor.toString(), requiredRoles: [thesis_dais_internship_manager_core_1.RoleType.Professor] },
            // Company reject
            { name: 'rejectedByCompany', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.WaitingForCompany.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.RejectedByCompany.toString(), requiredRoles: [thesis_dais_internship_manager_core_1.RoleType.Company] },
            // Student cancel
            { name: 'canceled', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.WaitingForProfessor.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.Canceled.toString(), requiredRoles: [thesis_dais_internship_manager_core_1.RoleType.Student, thesis_dais_internship_manager_core_1.RoleType.Professor] },
            { name: 'canceled', from: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.WaitingForCompany.toString(), to: thesis_dais_internship_manager_core_1.InternshipProposalStatusType.Canceled.toString(), requiredRoles: [thesis_dais_internship_manager_core_1.RoleType.Student, thesis_dais_internship_manager_core_1.RoleType.Professor] },
        ];
        this.stateMachine = new StateMachine({
            init: initialState.toString(),
            transitions: this.transitions
        });
    }
    /**
     * Return all the available state from the current one
     */
    getAvailableStates(userRole) {
        const transitions = this.stateMachine.transitions();
        const currentState = Number(this.stateMachine.state);
        const states = [
            {
                value: currentState,
                text: thesis_dais_internship_manager_core_1.InternshipProposalStatusType[currentState]
            }
        ];
        this.transitions.forEach(t => {
            const transition = userRole ? transitions.find(s => s === t.name && can_exec_helper_1.canExec(userRole, t.requiredRoles)) : transitions.find(s => s === t.name);
            if (transition) {
                const v = Number(t.to);
                if (!states.find(s => s.value === v)) {
                    states.push({
                        value: v,
                        text: thesis_dais_internship_manager_core_1.InternshipProposalStatusType[v]
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
    can(newState) {
        if (newState === null || newState === undefined)
            return false;
        const transition = this.transitions.find(t => t.to === newState.toString());
        return this.stateMachine.can(transition.name);
    }
}
exports.InternshipProposalStatusTypeMachine = InternshipProposalStatusTypeMachine;
