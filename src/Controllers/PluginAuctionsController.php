<?php

namespace PluginAuctions\Controllers;

use Plenty\Plugin\Controller;
use Plenty\Plugin\Templates\Twig;

class PluginAuctionsController extends Controller
{
    /**
     * @param Twig $twig
     * @return string
     */
    public function getHelloWorldPage(Twig $twig):string
    {
        return $twig->render('PluginAuctions::Index');
    }
}