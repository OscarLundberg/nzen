<script lang="ts" setup>
</script>


<template>
	<div class="fm-synth">        <-- simple FM synth, a few patches -->
		<input type="number"/> 
	</div>
	<div class="wavetable-synth"> <--- semi-modular wavetable synth, 2 osc linked - detunable, 1 filter hardwired, 1 filter lfo, 1 filter envelope -->
	<div class="groovebox"></div> <-- 4 basic drum patches -->
	<div class="fx"></div> <!-- plug to in or out -->
	<div class="looper"></div> <-- single track ? antything can be plugged in basic ditto style -->
	<div class="tapedeck"></div> <-- ~4 independent tracks, anything can plug into any track. track mixdown possible (many-to-one) -->
	<div class="quantized-delay"></div> <!-- set bpm, select whole/half/4th/8ths/16ths  affects all controls globally -->
	<div class="sequencer"></div> <!-- step sequencer // tracker style sequencer. plugs into either synth -->
</template>
