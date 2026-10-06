# 04 - The learner: 1D input, Fourier features, small MLP

Scope: the first half of the source doc's pipeline diagram and the external literature it matches.

## What the source doc says

The diagram's first 3 nodes: "1D input t" (node A) feeds "Learner: Fourier features" (node B), which feeds "Small MLP" (node C) (source doc). The parameter update node (node I) feeds back into both B and C, so the Fourier feature stage and the MLP are both learned objects (source doc). The input being 1D is load bearing: the whole learner exists to produce curves over the single parameter t (source doc).

## The external recipe this matches

This is the Fourier feature network recipe from the implicit neural representation literature. Tancik et al showed that passing input points through a simple Fourier feature mapping enables a multilayer perceptron to learn high frequency functions in low dimensional problem domains ([NeurIPS 2020 paper](https://proceedings.neurips.cc/paper/2020/file/55053683268957697aa39fba6f231c68-Paper.pdf), weight 0.20, weak). The same authors' companion page notes that in their NeRF work, a positional encoding of input coordinates helped networks learn significantly higher frequency detail ([Fourier Feature Networks](https://bmild.github.io/fourfeat/), weight 0.19, weak). Later work makes the mapping learnable rather than fixed: learnable Fourier features replace hard coded positional tokens for multi dimensional spatial inputs ([arXiv 2106.02795](https://arxiv.org/abs/2106.02795), weight 0.23, weak).

The mechanism these papers isolate is spectral bias: Fourier feature positional encoding transforms coordinate inputs with sinusoidal functions to capture high frequency detail, mitigating the spectral bias of neural networks ([emergentmind](https://www.emergentmind.com/topics/positional-encoding-using-fourier-features), weight 0.13, weak). Robustness work treats Random Fourier Features and positional encoding as manually set high frequency bases and studies their failure modes ([arXiv 2502.05482](https://arxiv.org/html/2502.05482v1), weight 0.16, weak).

## The implicit representation framing

The whole learner reads as an implicit neural representation of a 1D function. Implicit neural representations, also called coordinate networks or neural fields, are functions parameterized by multilayer perceptrons that map coordinates to signal values ([arXiv 2511.10142](https://arxiv.org/html/2511.10142v1), weight 0.15, weak). A continuous mapping network can serve as a compact representation of commonly encountered low dimensional signals ([Implicit Image Compression](https://varun19299.github.io/implicit-image-compression/), weight 0.16, weak). The source doc's use case is the minimal version of this: 1 scalar input, 2 curve outputs (source doc).

## Why "small" matters

The source doc specifies "Small MLP", not just MLP (source doc). The INR literature treats parameter count as a real design axis, with compact networks representing continuous functions as the point of the recipe ([arXiv 2511.10142](https://arxiv.org/html/2511.10142v1), weight 0.15, weak). Minimal MLP implementations are a standard teaching and prototyping artifact ([GitHub, miniMLP](https://github.com/neuralsorcerer/miniMLP), weight 0.18, weak). A small MLP over Fourier features of a single parameter is the cheapest architecture that can still express high frequency curve structure (weak synthesis from the NeurIPS 2020 anchor, weight 0.20).

## The loop through this stage

Because the parameter update returns to both the Fourier feature stage and the MLP (source doc), the input representation itself is trainable. This matches the learnable Fourier features line of work, where the frequency basis is optimized rather than fixed ([arXiv 2106.02795](https://arxiv.org/abs/2106.02795), weight 0.23, weak). It also matches the robustness literature's premise that the Fourier basis is a set of hyperparameters that can be set badly ([arXiv 2502.05482](https://arxiv.org/html/2502.05482v1), weight 0.16, weak): putting it inside the update loop is one answer to that fragility.

## Gaps

- The source doc does not specify the frequency count, encoding scheme, or MLP width and depth.
- No dig result addresses 1D curve learning specifically; the anchors are the general low dimensional domain literature, all weakly weighted (0.13 to 0.23).
