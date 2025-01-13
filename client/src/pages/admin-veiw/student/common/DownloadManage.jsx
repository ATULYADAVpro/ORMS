// PdfTableDocument.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
    },
    header: {
        fontSize: 20,
        marginBottom: 20,
    },
    table: {
        display: 'table',
        width: 'auto',
        margin: '10px 0',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        border: '1px solid black',
        padding: 5,
        fontSize: 10,
        textAlign: 'center',
    },
});

const PdfTableDocument = ({ data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Semester Data</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Code</Text>
                        <Text style={styles.tableCell}>Name</Text>
                        <Text style={styles.tableCell}>Internal Max</Text>
                        <Text style={styles.tableCell}>Internal Min</Text>
                        <Text style={styles.tableCell}>Internal Obt</Text>
                        <Text style={styles.tableCell}>External Max</Text>
                        <Text style={styles.tableCell}>External Min</Text>
                        <Text style={styles.tableCell}>External Obt</Text>
                        <Text style={styles.tableCell}>Total Max</Text>
                        <Text style={styles.tableCell}>Total Min</Text>
                        <Text style={styles.tableCell}>Total Obt</Text>
                        <Text style={styles.tableCell}>Grade</Text>
                        <Text style={styles.tableCell}>Grade Points</Text>
                        <Text style={styles.tableCell}>Credit Points</Text>
                    </View>
                    {data.subjects.map((sub, i) => (
                        <View style={styles.tableRow} key={i}>
                            <Text style={styles.tableCell}>{sub.subjectCode}</Text>
                            <Text style={styles.tableCell}>{sub.subjectName}</Text>
                            <Text style={styles.tableCell}>{sub.internalMax}</Text>
                            <Text style={styles.tableCell}>{sub.internalMin}</Text>
                            <Text style={styles.tableCell}>{sub.internal}</Text>
                            <Text style={styles.tableCell}>{sub.externalMax}</Text>
                            <Text style={styles.tableCell}>{sub.externalMin}</Text>
                            <Text style={styles.tableCell}>{sub.external}</Text>
                            <Text style={styles.tableCell}>{sub.totalMax}</Text>
                            <Text style={styles.tableCell}>{sub.totalMin}</Text>
                            <Text style={styles.tableCell}>{sub.totalMark}</Text>
                            <Text style={styles.tableCell}>{sub.grade}</Text>
                            <Text style={styles.tableCell}>{sub.gradePoint}</Text>
                            <Text style={styles.tableCell}>{sub.credit}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PdfTableDocument;