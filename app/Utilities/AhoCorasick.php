<?php

namespace App\Utilities;

// class TrieNode {
//     public $children = [];
//     public $isEndOfWord = false;
//     public $failLink = null;
//     public $word = null; // Store the word at the end of the Trie node
// }

// class AhoCorasick {
//     private $root;

//     public function __construct() {
//         $this->root = new TrieNode();
//     }

//     public function insert($word) {
//         $node = $this->root;
//         foreach (str_split($word) as $char) {
//             if (!isset($node->children[$char])) {
//                 $node->children[$char] = new TrieNode();
//             }
//             $node = $node->children[$char];
//         }
//         $node->isEndOfWord = true;
//         $node->word = $word; // Store the original word (no normalization)
//     }

//     public function buildFailureLinks() {
//         $queue = new \SplQueue();
//         $this->root->failLink = $this->root;
//         foreach ($this->root->children as $char => $node) {
//             $node->failLink = $this->root;
//             $queue->enqueue($node);
//         }

//         while (!$queue->isEmpty()) {
//             $currentNode = $queue->dequeue();
//             foreach ($currentNode->children as $char => $childNode) {
//                 $queue->enqueue($childNode);
//                 $failNode = $currentNode->failLink;
//                 while ($failNode !== $this->root && !isset($failNode->children[$char])) {
//                     $failNode = $failNode->failLink;
//                 }
//                 $childNode->failLink = isset($failNode->children[$char]) ? $failNode->children[$char] : $this->root;
//                 $childNode->isEndOfWord = $childNode->isEndOfWord || $childNode->failLink->isEndOfWord;
//                 if ($childNode->failLink->isEndOfWord && !$childNode->word) {
//                     $childNode->word = $childNode->failLink->word;
//                 }
//             }
//         }
//     }

//     public function search($text) {
//         $node = $this->root;
//         $length = strlen($text);
//         $foundWords = [];

//         for ($i = 0; $i < $length; $i++) {
//             $char = $text[$i];
//             while ($node !== $this->root && !isset($node->children[$char])) {
//                 $node = $node->failLink;
//             }
//             $node = isset($node->children[$char]) ? $node->children[$char] : $this->root;

//             // Collect all words detected at this point
//             $tempNode = $node;
//             while ($tempNode !== $this->root) {
//                 if ($tempNode->isEndOfWord) {
//                     $foundWords[] = $tempNode->word; // Return the original word
//                 }
//                 $tempNode = $tempNode->failLink;
//             }
//         }

//         return array_unique($foundWords); // Return unique detected words
//     }
// }


// New with normalize

class TrieNode {
    public $children = [];
    public $isEndOfWord = false;
    public $failLink = null;
    public $word = null; // Store the word at the end of the Trie node
}

class AhoCorasick {
    private $root;

    public function __construct() {
        $this->root = new TrieNode();
    }

    private function normalize($word) {
        // Normalize repeating characters, case-insensitive, and keep special characters intact
        return preg_replace('/(.)\\1+/i', '$1', strtolower($word));
    }

    public function insert($word) {
        $normalizedWord = $this->normalize($word); // Apply normalization and convert to lowercase
        $node = $this->root;
        foreach (str_split($normalizedWord) as $char) {
            if (!isset($node->children[$char])) {
                $node->children[$char] = new TrieNode();
            }
            $node = $node->children[$char];
        }
        $node->isEndOfWord = true;
        $node->word = $word; // Store the original word (before normalization)
    }

    public function buildFailureLinks() {
        $queue = new \SplQueue();
        $this->root->failLink = $this->root;
        foreach ($this->root->children as $char => $node) {
            $node->failLink = $this->root;
            $queue->enqueue($node);
        }

        while (!$queue->isEmpty()) {
            $currentNode = $queue->dequeue();
            foreach ($currentNode->children as $char => $childNode) {
                $queue->enqueue($childNode);
                $failNode = $currentNode->failLink;
                while ($failNode !== $this->root && !isset($failNode->children[$char])) {
                    $failNode = $failNode->failLink;
                }
                $childNode->failLink = isset($failNode->children[$char]) ? $failNode->children[$char] : $this->root;
                $childNode->isEndOfWord = $childNode->isEndOfWord || $childNode->failLink->isEndOfWord;
                if ($childNode->failLink->isEndOfWord && !$childNode->word) {
                    $childNode->word = $childNode->failLink->word;
                }
            }
        }
    }

    public function search($text) {
        $normalizedText = $this->normalize($text); // Normalize the input text for searching
        $node = $this->root;
        $length = strlen($normalizedText);
        $foundWords = [];

        for ($i = 0; $i < $length; $i++) {
            $char = $normalizedText[$i];
            while ($node !== $this->root && !isset($node->children[$char])) {
                $node = $node->failLink;
            }
            $node = isset($node->children[$char]) ? $node->children[$char] : $this->root;

            // Collect all words detected at this point
            $tempNode = $node;
            while ($tempNode !== $this->root) {
                if ($tempNode->isEndOfWord) {
                    $foundWords[] = $tempNode->word; // Return the original word
                }
                $tempNode = $tempNode->failLink;
            }
        }

        return array_unique($foundWords); // Return unique detected words
    }
}
