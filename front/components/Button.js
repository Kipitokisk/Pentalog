import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Button as PaperButton} from 'react-native-paper'
import {theme} from '../core/theme'

export default function Button({mode, style, ...props}) {
    return (
        <View style={[styles.shadowContainer]}>
            <PaperButton
                style={[
                    styles.button,
                    {borderWidth: 0},
                    {backgroundColor: theme.colors.surface},
                    style,
                ]}
                labelStyle={styles.text}
                mode={mode}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 260,
        marginVertical: 10,
        paddingVertical: 2,
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 26,
        fontFamily: 'DMSans-VariableFont_opsz,wght.ttf',
    },

    shadowContainer: {
        elevation: 5,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: {width: 0, height: 9},
        shadowRadius: 6,
    },
})
