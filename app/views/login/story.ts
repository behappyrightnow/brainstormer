interface GenerateIDFN {
  (): string;
}

interface Config {
    imageURL: string;
    sessionID: string;
    generateID: GenerateIDFN;
}
interface StorySleeve {
    sessionID: string;
    storyID: string;
    name: string;
    summary: string;
    text: string;
    interesting: number;
    powerful: number;
    imageURL: string;
}

class Story {
    name: string;
    summary: string;
    text: string;
    sessionID: string;
    interesting: number;
    powerful: number;
    imageURL: string;
    storyID: string;


    constructor(
        name: string,
        summary: string,
        text: string,
        config: Config,
        sessionID?: string,
        interesting?: number,
        powerful?: number,
        imageURL?: string,
        storyID?: string) {
        this.name = name;
        this.summary = summary;
        this.text = text;

        if (sessionID === undefined) {
            this.sessionID = config.sessionID;
            this.interesting = 0;
            this.powerful = 0;
            this.imageURL = config.imageURL;
            this.storyID = config.generateID();
        } else {
            this.sessionID = sessionID;
            this.interesting = interesting;
            this.powerful = powerful;
            this.imageURL = imageURL;
            this.storyID = storyID;
        }
    }

    toJSON(): StorySleeve {
        return {
                sessionID: this.sessionID,
                storyID: this.storyID,
                name: this.name,
                summary: this.summary,
                text: this.text,
                interesting: this.interesting,
                powerful: this.powerful,
                imageURL: this.imageURL
            }
    }
}

interface UpdateFunction {
    (story:ServedStory);
}
interface RefreshFunction {
    (viewScope:any);
}
class ServedStory extends Story {
    interestingVoted: boolean;
    powerfulVoted: boolean;
    updateFn: UpdateFunction;
    expanded: boolean;
    mode: string;
    currentSessionID: string;
    oldName: string;
    oldSummary: string;
    oldText: string;

    constructor(story: StorySleeve,
                config: Config,
                currentSessionID: string,
                updateFn: UpdateFunction) {
        super(
            story.name,
            story.summary,
            story.text,
            config,
            story.sessionID,
            story.interesting,
            story.powerful,
            story.imageURL,
            story.storyID
        );
        this.interestingVoted = false;
        this.powerfulVoted = false;
        this.updateFn = updateFn;
        this.expanded = false;
        this.currentSessionID = currentSessionID;
        this.mode = "regular";
        this.oldName = this.name;
        this.oldText = this.text;
        this.oldSummary = this.summary;
    }
    editable(): boolean {
        return this.sessionID === this.currentSessionID;
    }
    update($event) {
        $event.stopPropagation();
        this.mode = "regular";
        this.updateFn(this);
        this.oldName = this.name;
        this.oldSummary = this.summary;
        this.oldText = this.text;
    }
    cancelEdit($event) {
        $event.stopPropagation();
        this.mode = "regular";
        this.name = this.oldName;
        this.summary = this.oldSummary;
        this.text = this.oldText;
    }

    toggle($event) {
        $event.stopPropagation();
        if (this.sessionID !== this.currentSessionID) {
            this.expanded = !this.expanded;
        } else {
            if (this.mode === "regular") {
                this.mode = "edit";
            }
        }
    }
    voteInteresting() {
        if (this.powerfulVoted === true) {
            this.deregisterPowerful();
            this.registerInteresting();
        } else {
            if (this.interestingVoted === false) {
                this.registerInteresting();
            } else {
                this.deregisterInteresting();
            }
        }
        this.updateFn(this);
    }

    votePowerful() {
        if (this.interestingVoted === true) {
            this.deregisterInteresting();
            this.registerPowerful();
        } else {
            if (this.powerfulVoted === false) {
                this.registerPowerful();
            } else {
                this.deregisterPowerful();
            }
        }
        this.updateFn(this);
    }

    notVoted(): boolean {
        return this.interestingVoted === false && this.powerfulVoted === false;
    }
    private deregisterInteresting() {
        this.interesting--;
        this.interestingVoted = false;
    }

    private deregisterPowerful() {
        this.powerful--;
        this.powerfulVoted = false;
    }

    private registerPowerful() {
        this.powerfulVoted = true;
        this.powerful++;
    }
    private registerInteresting() {
        this.interestingVoted = true;
        this.interesting++;
    }

    public findSelfAndUpdate(stories:Array<ServedStory>) {
        for (var i=0;i<stories.length;i++) {
            if (stories[i].storyID === this.storyID) {
                var foundStory: ServedStory = stories[i];
                foundStory.name = this.name;
                foundStory.summary = this.summary;
                foundStory.text = this.text;
                foundStory.interesting = this.interesting;
                foundStory.powerful = this.powerful;
                foundStory.imageURL = this.imageURL;
                break;
            }
        }
    }
}