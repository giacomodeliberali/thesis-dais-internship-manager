import * as StateMachine from 'javascript-state-machine';
import { InternshipStatusType } from 'gdl-thesis-core/dist';

/**
 * The state machine helper for the [[InternshipStatusType]]
 */
export class InternshipStatusTypeMachine {

    /** The state machine */
    private stateMachine: StateMachine;

    /** The allowed transitions */
    private transitions = [
        { name: 'approved', from: InternshipStatusType.NotApproved.toString(), to: InternshipStatusType.Approved.toString() },
        { name: 'rejected', from: InternshipStatusType.NotApproved.toString(), to: InternshipStatusType.Rejected.toString() },
        { name: 'closed', from: InternshipStatusType.Approved.toString(), to: InternshipStatusType.Closed.toString() },
        { name: 'canceled', from: InternshipStatusType.NotApproved.toString(), to: InternshipStatusType.Canceled.toString() },
        { name: 'canceled', from: InternshipStatusType.Approved.toString(), to: InternshipStatusType.Canceled.toString() }
    ];

    /**
     * Create a new state machine initialized with a state
     * @param initialState The initial state of this machine
     */
    constructor(initialState: InternshipStatusType) {
        this.stateMachine = new StateMachine({
            init: initialState.toString(),
            transitions: this.transitions
        });
    }

    /**
     * Return all the available state from the current one
     */
    getAvailableStates() {
        const transitions: Array<string> = this.stateMachine.transitions();
        const currentState = Number(this.stateMachine.state);
        const states: Array<any> = [
            {
                value: currentState,
                text: InternshipStatusType[currentState]
            }
        ];
        this.transitions.forEach(t => {
            if (!!transitions.find(s => s === t.name)) {
                const v = Number(t.to);
                if (!states.find(s => s.value === v)) {
                    states.push({
                        value: v,
                        text: InternshipStatusType[v]
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
    can(newState: InternshipStatusType) {
        if (newState === null || newState === undefined)
            return false;
        const transition = this.transitions.find(t => t.to === newState.toString());
        return this.stateMachine.can(transition.name);
    }
}