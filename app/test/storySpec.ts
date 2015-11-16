/// <reference path="../lib/vendorTypeDefinitions/jasmine.d.ts" />
/// <reference path="../views/login/story.ts" />

describe("Card tests", function () {
    var story:Story;
    var config:Config
    beforeEach(function() {
        config = {
            imageURL: "http://someimage.url",
            sessionID: "1234",
            generateID: function() {
                return "Story1"
            }
        };
        story = new Story("guest", "My lovely story", "Yankee doodle went to town", config);
    });
    it("should initialize properly", function() {
        expect(story.name).toBe("guest");
        expect(story.summary).toBe("My lovely story");
        expect(story.text).toBe("Yankee doodle went to town");
        expect(story.sessionID).toBe("1234");
        expect(story.imageURL).toBe("http://someimage.url");
        expect(story.powerful).toBe(0);
        expect(story.interesting).toBe(0);
        expect(story.storyID).toBe("Story1");
    });
    describe("Served Cards", function() {
        var story:ServedStory;
        var updateFnCalled: boolean;
        var storySleeve: StorySleeve;
        beforeEach(function() {
            storySleeve = {
                sessionID: "1234",
                storyID: "Story1",
                name: "guest",
                summary: "My lovely story",
                text: "Yankee doodle went to town",
                interesting: 2,
                powerful: 1,
                imageURL: "http://niceimage.com"
            };
            updateFnCalled = false;
            var updateFn:UpdateFunction = function(card: ServedStory) {
                updateFnCalled = true;
            }
            var currentSessionID = "2345";
            story = new ServedStory(storySleeve, config, currentSessionID, updateFn);
        });
        it("should initialize properly", function() {
            expect(story.name).toBe("guest");
            expect(story.summary).toBe("My lovely story");
            expect(story.text).toBe("Yankee doodle went to town");
            expect(story.sessionID).toBe("1234");
            expect(story.imageURL).toBe("http://niceimage.com");
            expect(story.powerful).toBe(1);
            expect(story.interesting).toBe(2);
            expect(story.storyID).toBe("Story1");
            expect(story.interestingVoted).toBe(false);
            expect(story.powerfulVoted).toBe(false);
        });
        describe("update should", function() {
            it("call updateFn", function() {
                expect(updateFnCalled).toBe(false);
                var event = {
                    stopPropagation: function() {}
                }
                story.update(event);
                expect(updateFnCalled).toBe(true);
            });
            it("toggle mode to edit", function() {
                story.currentSessionID = "1234";
                story.toggle();
                expect(story.mode).toBe("edit");
            });
        });

        describe("should support toggling of text when sessionIDs don't match", function() {
            it("should expand text when first toggled", function() {
                expect(story.expanded).toBe(false);
                story.toggle();
                expect(story.expanded).toBe(true);
            });
            it("should contract text when toggled twice", function() {
                expect(story.expanded).toBe(false);
                story.toggle();
                story.toggle();
                expect(story.expanded).toBe(false);
            });
        });
        describe("should not support toggling of text when sessionIDs match", function() {
            beforeEach(function() {
                story.currentSessionID = "1234";
            });
            it("should not expand text when toggled", function() {
                expect(story.expanded).toBe(false);
                story.toggle();
                expect(story.expanded).toBe(false);
            });
            it("should change mode to edit", function() {
                expect(story.mode).toBe("regular");
                story.toggle();
                expect(story.mode).toBe("edit");
            });
        });
        describe("voting", function() {
            it("should initialize as not voted", function() {
                expect(story.notVoted()).toBe(true);
            });
            it("should not detract from powerful when interesting is first voted", function() {
                story.voteInteresting();
                expect(story.interesting).toBe(3);
                expect(story.powerful).toBe(1);
                expect(story.interestingVoted).toBe(true);
                expect(story.powerfulVoted).toBe(false);
            });
            it("should support vote switching from interesting to powerful", function() {
                story.voteInteresting();
                story.votePowerful();
                expect(story.interesting).toBe(2);
                expect(story.powerful).toBe(2);
                expect(story.interestingVoted).toBe(false);
                expect(story.powerfulVoted).toBe(true);
            });

            it("should support vote switching from powerful to interesting", function() {
                story.votePowerful();
                story.voteInteresting();
                expect(story.interesting).toBe(3);
                expect(story.powerful).toBe(1);
                expect(story.interestingVoted).toBe(true);
                expect(story.powerfulVoted).toBe(false);
            });
            it("two subsequent interesting votes should negate each other", function() {
                story.voteInteresting();
                story.voteInteresting();
                expect(story.interesting).toBe(2);
                expect(story.powerful).toBe(1);
                expect(story.interestingVoted).toBe(false);
                expect(story.powerfulVoted).toBe(false);
            });
            it("should call update function when voting interesting", function() {
                expect(updateFnCalled).toBe(false);
                story.voteInteresting();
                expect(updateFnCalled).toBe(true);
            });
            it("should call update function when voting powerful", function() {
                expect(updateFnCalled).toBe(false);
                story.votePowerful();
                expect(updateFnCalled).toBe(true);
            });
        });
        describe("should find and update self", function() {
            var stories;
            beforeEach(function() {
                stories = new Array<ServedStory>();
                storySleeve.storyID = "Story1";
                var story1 = new ServedStory(storySleeve, config, "5678", null);
                var storySleeve2 = {
                    sessionID: "1234",
                    storyID: "Story2",
                    name: "guest",
                    summary: "My lovely story",
                    text: "Yankee doodle went to town",
                    interesting: 2,
                    powerful: 1,
                    imageURL: "http://niceimage.com"
                };
                var story2 = new ServedStory(storySleeve2, config, "5678", null);
                stories.push(story1);
                stories.push(story2);

            });
            it("from different session", function() {
                var storySleeve3 = {
                    sessionID: "1234",
                    storyID: "Story2",
                    name: "Tony",
                    summary: "My lovely story",
                    text: "Yankee doodle went to town",
                    interesting: 2,
                    powerful: 1,
                    imageURL: "http://niceimage2.com"
                };
                var newStoryFromServer = new ServedStory(storySleeve3, config, "5678", null);
                newStoryFromServer.findSelfAndUpdate(stories);
                expect(stories.length).toEqual(2);
                expect(stories[0].name).toEqual("guest");
                expect(stories[1].name).toEqual("Tony");
                expect(stories[1].toJSON()).toEqual(newStoryFromServer.toJSON());
            });

        });

    });


});
