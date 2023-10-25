import {Datum} from "./Datum";
import {Operations, Topic} from "./Topics/Topic";
import {MRU} from "./Topics/MRU";
import {MRUV} from "./Topics/MRUV";
import {TopicNotFound} from "../Exceptions/Problem/TopicNotFound";

class Problem {

    private topics : Array<Topic> = [
        new MRU,
        new MRUV,
    ];

    public topic : Topic | undefined;

    constructor (requested : Array<string>, data : Array<Datum>) {

        // Get which data we need solve
        const problemTopics = requested;

        problemTopics.concat( data.map( (datum) => {
            return datum.name;
        }));

        // Check to which topic does it belong the data that we need solve
        const problemsForTopic : {
            [key : string] : number
        } = {};
        this.topics.forEach( (topic : Topic) => {

            problemsForTopic[topic.name] = 0;

            Object.keys(topic.equations).forEach( (nameOfEquation : string) => {

                if(problemTopics.includes(nameOfEquation)) {
                    problemsForTopic[topic.name] += 1;
                }

            });

        });

        // Check topic with more data
        let topicChoosed : string = "";
        let maxTopicChoosed : number = 0;
        Object.keys(problemsForTopic).forEach( (nameOfTopic : string) => {

            if(problemsForTopic[nameOfTopic] > maxTopicChoosed) {

                topicChoosed = nameOfTopic;

                maxTopicChoosed = problemsForTopic[nameOfTopic];
            }
        });

        // Get instance of topic
        this.topic = this.topics.find( (topic : Topic) => {
            return (topic.name === topicChoosed);
        });
    }

    /**
     *
     * @param requested
     * @param data
     */
    check (requested: Array<keyof Operations>, data: Array<Datum>): Array<Datum> {

        if(!this.topic) {
            throw new TopicNotFound();
        }

        // Set data to topic
        this.topic.data = data;

        // Process requested data
        for(const requestedField of requested) {
            this.topic.solveEquation(requestedField);
        }

        // Get all data and match it with requested
        return this.topic.data.filter((datum: Datum) => {
            return requested.some((requestedField: string) => {
                return requestedField === datum.name;
            });
        });

    }
}

export { Problem }
