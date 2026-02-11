export interface WithSkillsRead {
	addSkillRead(skill: string): Promise<void> | void;
	getSkillsRead(): Promise<string[]>;
}
