var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Story = (function () {
    function Story(name, summary, text, config, sessionID, interesting, powerful, imageURL, storyID) {
        this.name = name;
        this.summary = summary;
        this.text = text;
        if (sessionID === undefined) {
            this.sessionID = config.sessionID;
            this.interesting = 0;
            this.powerful = 0;
            this.imageURL = config.imageURL;
            this.storyID = config.generateID();
        }
        else {
            this.sessionID = sessionID;
            this.interesting = interesting;
            this.powerful = powerful;
            this.imageURL = imageURL;
            this.storyID = storyID;
        }
    }
    Story.prototype.toJSON = function () {
        return {
            sessionID: this.sessionID,
            storyID: this.storyID,
            name: this.name,
            summary: this.summary,
            text: this.text,
            interesting: this.interesting,
            powerful: this.powerful,
            imageURL: this.imageURL
        };
    };
    return Story;
})();
var ServedStory = (function (_super) {
    __extends(ServedStory, _super);
    function ServedStory(story, config, currentSessionID, updateFn) {
        _super.call(this, story.name, story.summary, story.text, config, story.sessionID, story.interesting, story.powerful, story.imageURL, story.storyID);
        this.interestingVoted = false;
        this.powerfulVoted = false;
        this.updateFn = updateFn;
        this.expanded = false;
        this.currentSessionID = currentSessionID;
        this.mode = "regular";
    }
    ServedStory.prototype.update = function ($event) {
        $event.stopPropagation();
        this.mode = "regular";
        this.updateFn(this);
    };
    ServedStory.prototype.toggle = function () {
        if (this.sessionID !== this.currentSessionID) {
            this.expanded = !this.expanded;
        }
        else {
            if (this.mode === "regular") {
                this.mode = "edit";
            }
        }
    };
    ServedStory.prototype.voteInteresting = function () {
        if (this.powerfulVoted === true) {
            this.deregisterPowerful();
            this.registerInteresting();
        }
        else {
            if (this.interestingVoted === false) {
                this.registerInteresting();
            }
            else {
                this.deregisterInteresting();
            }
        }
        this.updateFn(this);
    };
    ServedStory.prototype.votePowerful = function () {
        if (this.interestingVoted === true) {
            this.deregisterInteresting();
            this.registerPowerful();
        }
        else {
            if (this.powerfulVoted === false) {
                this.registerPowerful();
            }
            else {
                this.deregisterPowerful();
            }
        }
        this.updateFn(this);
    };
    ServedStory.prototype.notVoted = function () {
        return this.interestingVoted === false && this.powerfulVoted === false;
    };
    ServedStory.prototype.deregisterInteresting = function () {
        this.interesting--;
        this.interestingVoted = false;
    };
    ServedStory.prototype.deregisterPowerful = function () {
        this.powerful--;
        this.powerfulVoted = false;
    };
    ServedStory.prototype.registerPowerful = function () {
        this.powerfulVoted = true;
        this.powerful++;
    };
    ServedStory.prototype.registerInteresting = function () {
        this.interestingVoted = true;
        this.interesting++;
    };
    ServedStory.prototype.findSelfAndUpdate = function (stories) {
        for (var i = 0; i < stories.length; i++) {
            if (stories[i].storyID === this.storyID) {
                var foundStory = stories[i];
                foundStory.name = this.name;
                foundStory.summary = this.summary;
                foundStory.text = this.text;
                foundStory.interesting = this.interesting;
                foundStory.powerful = this.powerful;
                foundStory.imageURL = this.imageURL;
                break;
            }
        }
    };
    return ServedStory;
})(Story);
//# sourceMappingURL=story.js.map