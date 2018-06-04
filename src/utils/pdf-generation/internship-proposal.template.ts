import { InternshipProposal } from "gdl-thesis-core/dist";
import * as moment from 'moment';
import 'moment/locale/it';
/**
 * Return the document template object used to generate a PDF
 *
 * @param {InternshipProposal} proposal The InternshipProposal of which obtain the PDF template
 * @returns The template object model
 */
export function generateInternshipProposalTemplate(proposal: InternshipProposal): any {
    let elementPerCol = 0;
    if (proposal.attendances && proposal.attendances.length > 0) {
        elementPerCol = Math.ceil(proposal.attendances.length / 3);
    }

    const genColumns = () => {
        const cols = [];
        let currentIndex = 0;
        for (let i = 0; i < 3; i++) {
            cols.push({
                table: {
                    body: [
                        ['Data', 'Ore lavorate'],
                        ...proposal.attendances.slice(currentIndex, currentIndex + elementPerCol).map(p => {
                            return [
                                {
                                    text: moment(p.date).format('ll'),
                                    alignment: 'center'
                                },
                                {
                                    text: p.hours,
                                    alignment: 'center'
                                }
                            ];
                        })
                    ]
                }
            });
            currentIndex += elementPerCol;
        }
        return cols;
    };

    const totalWorkedHours = proposal.attendances.map(p => p.hours).reduce(((acc, val) => acc + val));

    const documentDefinition = {
        images: {
            logo: './assets/images/logo-unive.jpg'
        },
        header: {
            image: 'logo',
            width: 100,
            alignment: 'right',
            // margin: [left, top, right, bottom]
            margin: [0, 20, 10, 0]
        },
        content: [
            { text: 'Resoconto tirocinio', style: ['header'] },
            { text: proposal.internship.title, style: ['SubHeader'] },
            '\n',
            `Studente: ${proposal.student.name}`,
            `Professore: ${proposal.professor.name}`,
            `Azienda: ${proposal.internship.company.name}`,
            '\n',
            { text: 'Dettagli tirocinio', style: ['header'] },
            '\n',
            `Data inizio: ${proposal.endDate || 'Non specificata'}`,
            `Data fine: ${proposal.endDate || 'Non specificata'}`,
            `Luogo di lavoro: ${proposal.internship.address.city}`,
            '\n',
            { text: 'Foglio presenze', style: ['header'] },
            '\n',
            `Le seguenti tabelle riportano le giornate lavorate e la quantità di ore. Totale ore lavorate ${totalWorkedHours}.`,
            '\n',
            {
                columns: genColumns()
            },
            '\n',
            '\n',
            '\n',
            '\n',
            '\n',
            '\n',
            '\n',
            {
                columns: [
                    {
                        text: '__________________________\nFirma professore',
                        alignment: 'center'
                    },
                    {
                        text: '__________________________\nFirma azienda',
                        alignment: 'center'
                    },
                    {
                        text: '__________________________\nFirma studente',
                        alignment: 'center'
                    }
                ]
            }
        ],
        styles: {
            header: {
                fontSize: 18
            },
            subHeader: {
                fontSize: 14
            }
        }
    };

    return documentDefinition;
}