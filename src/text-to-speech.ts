import * as AWS from 'aws-sdk'

const pollyClient = new AWS.Polly({
    region: 'us-west-2'
});

export default function toSpeech(text: string): Promise<Buffer> {
    const params: AWS.Polly.Types.SynthesizeSpeechInput = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: 'Maxim'
    };

    return new Promise<Buffer>((resolve, reject) => {
        pollyClient.synthesizeSpeech(params, (err, data) => {
                if (err) {
                    reject(err);
                } else if (data) {
                    if (data.AudioStream instanceof Buffer) {
                        resolve(data.AudioStream);
                    }
                }
            });
    });
}
